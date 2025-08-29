const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
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
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Schema & Model
const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const Task = mongoose.model("Task", taskSchema);

// Routes
app.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.render("index", { tasks: tasks });
  } catch (err) {
    res.status(500).send("❌ Error fetching tasks: " + err);
  }
});

app.post("/addtask", async (req, res) => {
  try {
    const task = new Task({ name: req.body.task });
    await task.save();
    res.redirect("/");
  } catch (err) {
    res.status(500).send("❌ Error adding task: " + err);
  }
});

app.post("/deletetask", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.body.taskId);
    res.redirect("/");
  } catch (err) {
    res.status(500).send("❌ Error deleting task: " + err);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
