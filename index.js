const express = require("express");
const bodyParser = require("body-parser");

var app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://vijay:vijay@todoadmin.llaun5y.mongodb.net/todo?retryWrites=true&w=majority&appName=todoAdmin", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const taskSchema = new mongoose.Schema({
    name: String,
    priority: { type: String, enum: ["low","medium", "high"], default: "low" }
});

const item = mongoose.model("task", taskSchema);

app.get("/", function(req, res){
    item.find({})
        .then(foundItems => {
            res.render("list", { todoItems: foundItems });
        })
        .catch(err => console.log(err));
});

app.post("/", function(req, res){
    const itemName = req.body.ele1;
    const priority = req.body.priority || "Low";

    if (!itemName.trim()) {
        return res.send("<script>alert('Task cannot be empty');window.location='/';</script>");
    }

    const todo = new item({ name: itemName, priority: priority });
    todo.save()
        .then(() => res.send("<script>alert('Task added successfully');window.location='/';</script>"))
        .catch(err => console.log(err));
});

app.post("/delete/:id", (req, res) => {
    const id = req.params.id;
    item.findByIdAndDelete(id)
        .then(() => res.send("<script>alert('Task deleted successfully');window.location='/';</script>"))
        .catch(err => console.log(err));
});

app.post("/edit/:id", (req, res) => {
    const id = req.params.id;
    const updatedText = req.body.newText || ""; 

    if (!updatedText.trim()) {
        return res.send("<script>alert('Task cannot be empty');window.location='/';</script>");
    }

    item.findByIdAndUpdate(id, { name: updatedText })
        .then(() => res.send("<script>alert('Task updated successfully');window.location='/';</script>"))
        .catch(err => console.log(err));
});


app.get("/filter", (req, res) => {
    const priority = req.query.priority;

    if (priority === "all") {
        item.find({})
            .then(allTasks => res.render("list", { todoItems: allTasks }))
            .catch(err => console.log(err));
    } else {
        item.find({ priority: priority })
            .then(filtered => res.render("list", { todoItems: filtered }))
            .catch(err => console.log(err));
    }
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
