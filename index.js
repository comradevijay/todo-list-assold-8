const express = require("express");
// Note: body-parser is included in modern Express. You can use express.urlencoded instead.
// const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true })); // <-- BEST PRACTICE: Replaces body-parser
app.use(express.static("public"));
app.set("view engine", "ejs");

// Environment variables
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;

// ✅ Check Mongo URI
if (!MONGO_URI) {
  console.error("❌ No MONGO_URI found in environment!");
  process.exit(1);
}

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }) // <-- Added options for modern Mongoose
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Schema & Model
// <-- FIX: Expanded the schema to match the fields used in list.ejs
const taskSchema = new mongoose.Schema({
  title: { // Changed from 'name' to 'title' to match EJS
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ["Low", "High", "Urgent"], // Ensures only these values are allowed
    default: "Low",
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const Task = mongoose.model("Task", taskSchema);

// --- Routes ---

// GET all tasks
app.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({});
    // <-- FIX: Changed "index" to "list" to match your file name
    res.render("list", { tasks: tasks }); 
  } catch (err) {
    res.status(500).send("❌ Error fetching tasks: " + err);
  }
});

// ADD a new task
// <-- FIX: Route changed from "/addtask" to "/add" to match the form action
app.post("/add", async (req, res) => {
  try {
    const task = new Task({
      title: req.body.task, // Field name from the input form
      priority: req.body.priority, // Field name from the select form
    });
    await task.save();
    res.redirect("/");
  } catch (err) {
    res.status(500).send("❌ Error adding task: " + err);
  }
});

// DELETE a task
// <-- FIX: Changed route to use URL parameters for the ID, matching the form
app.post("/delete/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (err) {
    res.status(500).send("❌ Error deleting task: " + err);
  }
});

// <-- NEW: Added the missing route to toggle task completion
app.post("/toggle/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task) {
      task.completed = !task.completed; // Flip the boolean value
      await task.save();
    }
    res.redirect("/");
  } catch (err) {
    res.status(500).send("❌ Error toggling task: " + err);
  }
});

// <-- NEW: Added the missing route to edit task priority
app.post("/edit/:id", async (req, res) => {
    try {
        await Task.findByIdAndUpdate(req.params.id, { priority: req.body.priority });
        res.redirect("/");
    } catch (err) {
        res.status(500).send("❌ Error updating task: " + err);
    }
});


// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});