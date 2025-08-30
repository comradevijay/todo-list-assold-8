const express = require("express");
const methodOverride = require("method-override");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

let tasks = [];

app.get("/", (req, res) => {
  res.render("list", { tasks });
});

app.post("/add", (req, res) => {
  const task = req.body.task;
  if (!task || !task.trim()) {
    return res.redirect("/");
  }
  tasks.push({ text: task.trim(), done: false });
  res.redirect("/");
});

app.put("/toggle/:index", (req, res) => {
  const index = req.params.index;
  if (tasks[index]) {
    tasks[index].done = !tasks[index].done;
  }
  res.redirect("/");
});

app.delete("/delete/:index", (req, res) => {
  const index = req.params.index;
  if (tasks[index]) {
    tasks.splice(index, 1);
  }
  res.redirect("/");
});

app.listen(8000, () => {
  console.log("Server running at http://localhost:8000");
});
