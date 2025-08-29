const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const PORT = process.env.PORT || 8000;

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify:false
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// --- Schema ---
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  priority: { type: String, enum: ["High", "Low", "Urgent"], default: "Low" },
  completed: { type: Boolean, default: false } // New field for completed tasks
});

// --- Model ---
const Task = mongoose.model("Task", taskSchema);

// --- Routes ---

// GET home page
app.get("/", function (req, res) {
  Task.find({}, function (err, foundItems) {
    if (err) {
      console.log(err);
      res.render("list", { tasks: [], message: null });
    } else {
      res.render("list", { tasks: foundItems, message: req.query.message });
    }
  });
});

// POST /add - add new task
app.post("/add", function (req, res) {
  const itemTitle = req.body.task;
  const itemPriority = req.body.priority;

  if (!itemTitle || itemTitle.trim() === "") {
    return res.redirect("/?message=empty_task");
  }

  const task = new Task({ title: itemTitle, priority: itemPriority });

  task.save(function (err) {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      res.redirect("/?message=add_success");
    }
  });
});

// POST /edit/:id - edit task priority
app.post("/edit/:id", function (req, res) {
  const taskId = req.params.id;
  const newPriority = req.body.priority;

  Task.findByIdAndUpdate(taskId, { priority: newPriority }, function (err) {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      res.redirect("/?message=update_success");
    }
  });
});

// POST /delete/:id - delete task
app.post("/delete/:id", function (req, res) {
  const taskId = req.params.id;
  Task.findByIdAndRemove(taskId, function (err) {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      res.redirect("/?message=delete_success");
    }
  });
});

// POST /toggle/:id - mark task completed/uncompleted
app.post("/toggle/:id", function (req, res) {
  const taskId = req.params.id;
  Task.findById(taskId, function (err, task) {
    if (err || !task) {
      console.log(err);
      res.redirect("/");
    } else {
      task.completed = !task.completed;
      task.save((err) => {
        if (err) console.log(err);
        res.redirect("/");
      });
    }
  });
});

// --- Start server ---
app.listen(PORT, function () {
  console.log(`🚀 Server is running on port ${PORT}`);
});
