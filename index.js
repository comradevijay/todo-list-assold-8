const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MongoDB connection string missing");
  process.exit(1);
}

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Schema & Model
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  priority: { type: String, enum: ["Low", "High", "Urgent"], default: "Low" },
  completed: { type: Boolean, default: false },
});

const Task = mongoose.model("Task", taskSchema);

// Routes
app.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.render("list", { tasks });
  } catch (err) {
    res.status(500).send("Error fetching tasks: " + err);
  }
});

app.post("/add", async (req, res) => {
  try {
    const task = new Task({
      title: req.body.task,
      priority: req.body.priority,
    });
    await task.save();
    res.redirect("/");
  } catch (err) {
    res.status(500).send("Error adding task: " + err);
  }
});

app.post("/delete/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (err) {
    res.status(500).send("Error deleting task: " + err);
  }
});

app.post("/toggle/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task) {
      task.completed = !task.completed;
      await task.save();
    }
    res.redirect("/");
  } catch (err) {
    res.status(500).send("Error toggling task: " + err);
  }
});

app.post("/edit/:id", async (req, res) => {
  try {
    await Task.findByIdAndUpdate(req.params.id, { priority: req.body.priority });
    res.redirect("/");
  } catch (err) {
    res.status(500).send("Error updating task: " + err);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
