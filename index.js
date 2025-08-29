const express = require("express");
const methodOverride = require("method-override"); // 1. Require the package
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method")); // 2. Use the middleware

// In-memory storage
let tasks = [];

app.get("/", (req, res) => {
  res.render("list", { tasks });
});

app.post("/add", (req, res) => {
  const task = req.body.task;
  if (task.trim() === "") {
    return res.send(
      "<script>alert('Task cannot be empty'); window.location.href='/'</script>"
    );
  }
  tasks.push({ text: task, done: false });
  res.redirect("/");
});

// 3. Changed from app.post to app.put
app.put("/toggle/:index", (req, res) => {
  const index = req.params.index;
  if (tasks[index]) {
    tasks[index].done = !tasks[index].done;
  }
  res.redirect("/");
});

// 4. Changed from app.post to app.delete
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