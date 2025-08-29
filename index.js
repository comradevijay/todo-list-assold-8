// index.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (if you have frontend views/public folder)
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Schema & Model
const taskSchema = new mongoose.Schema({
  name: String,
});

const Task = mongoose.model("Task", taskSchema);

// Routes
app.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks); // you can render a template instead if using EJS
  } catch (err) {
    res.status(500).send("Error fetching tasks");
  }
});

app.post("/add", async (req, res) => {
  try {
    const task = new Task({ name: req.body.name });
    await task.save();
    res.redirect("/"); // or res.json(task) if frontend is React
  } catch (err) {
    res.status(500).send("Error saving task");
  }
});

// For Render health check
app.get("/health", (req, res) => res.send("OK"));

// Use Render’s PORT
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
