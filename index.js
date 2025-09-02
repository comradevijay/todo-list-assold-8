const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

let items = [];

app.get("/", (req, res) => {
  res.render("list", { todoItems: items });
});

app.post("/add", (req, res) => {
  const todoText = req.body.ele1;

  if (!todoText || todoText.trim() === "") {
    return res.send("<script>alert('Task cannot be empty!'); window.location.href='/'</script>");
  }

  const newTodo = {
    id: Date.now().toString(),
    text: todoText,
    priority: req.body.priority || "low"
  };

  items.push(newTodo);
  res.redirect("/"); 
});

app.post("/edit/:id", (req, res) => {
  const idToEdit = req.params.id;
  const newText = req.body.newText;

  if (!newText || newText.trim() === "") {
    return res.send("<script>alert('Updated task cannot be empty!'); window.location.href='/'</script>");
  }

  items = items.map(item =>
    item.id === idToEdit ? { ...item, text: newText } : item
  );

  res.redirect("/");
});

app.post("/delete/:id", (req, res) => {
  const idToDelete = req.params.id;

  items = items.filter(item => item.id !== idToDelete);
  res.redirect("/");
});

app.get("/filter", (req, res) => {
  const priority = req.query.priority;

  if (priority === "all") {
    return res.render("list", { todoItems: items });
  }

  const filteredItems = items.filter(item => item.priority === priority);
  res.render("list", { todoItems: filteredItems });
});


app.listen(8000, function() {
  console.log("Server started successfully on port 8000.");
});