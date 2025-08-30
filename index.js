const express = require("express");
const methodOverride = require("method-override");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// In-memory storage
let tasks = [];  // each task: { text, done, priority }

// Home page
app.get("/", (req, res) => {
  const filter = req.query.priority || "all";
  let filteredTasks = tasks;

  if (filter !== "all") {
    filteredTasks = tasks.filter(t => t.priority === filter);
  }

  res.render("list", { tasks: filteredTasks, filter });
});

// Add a task
app.post("/add", (req, res) => {
  const { task, priority } = req.body;

  if (!task || !task.trim()) {
    return res.send("<script>alert('Task cannot be empty!'); window.location='/';</script>");
  }

  tasks.push({ text: task.trim(), done: false, priority: priority || "low" });
  res.redirect("/");
});

// Toggle done/undone
app.put("/toggle/:index", (req, res) => {
  const idx = req.params.index;
  if (tasks[idx]) tasks[idx].done = !tasks[idx].done;
  res.redirect("/");
});

// Edit task
app.put("/edit/:index", (req, res) => {
  const idx = req.params.index;
  const newText = req.body.task;
  if (tasks[idx] && newText.trim()) {
    tasks[idx].text = newText.trim();
  }
  res.redirect("/");
});

// Delete task
app.delete("/delete/:index", (req, res) => {
  const idx = req.params.index;
  if (tasks[idx]) tasks.splice(idx, 1);
  res.redirect("/");
});

app.listen(8000, () => {
  console.log("✅ Server started on http://localhost:8000");
});
