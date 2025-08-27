const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// in-memory storage
let tasks = [];

app.get("/", (req, res) => {
  res.render("list", { tasks });
});

app.post("/add", (req, res) => {
  const task = req.body.task;
  if (task.trim() === "") {
    return res.send("<script>alert('Task cannot be empty'); window.location.href='/'</script>");
  }
  tasks.push({ text: task, done: false });
  res.redirect("/");
});

app.post("/toggle/:index", (req, res) => {
  const index = req.params.index;
  tasks[index].done = !tasks[index].done;
  res.redirect("/");
});

app.post("/delete/:index", (req, res) => {
  const index = req.params.index;
  tasks.splice(index, 1);
  res.redirect("/");
});

app.listen(8000, () => {
  console.log("Server running at http://localhost:8000");
});
