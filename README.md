# ✅ Todo List Web Application

## **Project Overview**

This is a modern **Todo List web application** built with **Node.js, Express, EJS, and MongoDB**. It allows users to efficiently manage tasks by adding, editing, deleting, and marking tasks as completed. The application uses **MongoDB Atlas** for data storage, ensuring that all tasks are stored persistently.

---

## **Features**

* **Add Tasks:** Users can add new tasks with a title and priority (`Low`, `High`, `Urgent`). Empty titles are not allowed.
* **Edit Tasks:** Edit task priority using a **pencil icon**.
* **Delete Tasks:** Remove tasks individually with **confirmation alert**.
* **Mark as Completed:** Check a task to mark it as completed (line-through + gray).
* **Alerts:** Notifications appear on task addition, update, deletion, or empty input.
* **Responsive UI:** Clean and responsive layout for desktop and mobile devices.

---

## **Technology Stack**

| Layer      | Technology                           |
| ---------- | ------------------------------------ |
| Frontend   | HTML, CSS, EJS (Embedded JavaScript) |
| Backend    | Node.js, Express.js                  |
| Database   | MongoDB Atlas                        |
| Deployment | Render (Node.js Web Service)         |

---

## **Database Structure**

MongoDB collection: **`tasks`**

| Field       | Type    | Description                              |
| ----------- | ------- | ---------------------------------------- |
| `title`     | String  | Title of the task                        |
| `priority`  | String  | Task priority: `Low`, `High`, `Urgent`   |
| `completed` | Boolean | Whether task is completed (`true/false`) |

---

## **Installation & Setup**

1. Clone the repository:

```bash
git clone https://github.com/comradevijay/todo-list-assold-8
cd todo-app
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with your MongoDB Atlas URI:

```
MONGO_URI=your_mongodb_atlas_connection_string
PORT=8000
```

4. Run the application locally:

```bash
node index.js
```

5. Open your browser and navigate to:

```
http://localhost:8000
```

---

## **Deployment**

The project is deployed on **Render**.

* **Render Deployment Link:** [https://your-render-link.onrender.com](https://your-render-link.onrender.com)

> Make sure to update the link with your actual deployment URL.

---

## **Usage**

1. Add a new task by entering a title and selecting priority, then click `+`.
2. Edit task priority by clicking the **pencil icon**, select new priority, and click ✔️.
3. Mark a task as completed by checking the checkbox. Completed tasks appear gray with line-through.
4. Delete a task by clicking the trash 🗑️ icon.


## **Project Submission**

* **Server file:** `index.js`
* **Frontend:** `list.ejs` & `styles.css`
* **Deployment:** Render
* **GitHub Repository:** `https://github.com/comradevijay/todo-list-assold-8`
