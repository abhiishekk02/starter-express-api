const db = require("../db/test");

const TodoListController = {
  getAllTodos: (req, res) => {
    const sqlQuery = "SELECT * FROM todoListDataDB";
    db.query(sqlQuery, (err, result) => {
      if (err) {
        console.error("Error fetching todos:", err);
        res.status(500).json("Internal Server Error");
      } else {
        res.json(result);
      }
    });
  },

  addTodo: (req, res) => {
    const { todo } = req.body;
    console.log(todo);
    const sqlQuery = "INSERT INTO todoListDataDB (todo) VALUES (?)";
    db.query(sqlQuery, [todo], (err, result) => {
      if (err) {
        console.error("Error adding todo:", err);
        res.status(500).json("Internal Server Error");
      } else {
        res.status(201).json("Todo added successfully");
      }
    });
  },

  deleteTodo: (req, res) => {
    const { id } = req.params;
    const sqlQuery = "DELETE FROM todoListDataDB WHERE todo_id = ?";
    db.query(sqlQuery, [id], (err, result) => {
      if (err) {
        console.error("Error deleting todo:", err);
        res.status(500).json("Internal Server Error");
      } else if (result.affectedRows === 0) {
        // Check if no rows were affected by the delete query
        res.status(404).json("Todo not found");
      } else {
        res.status(200).json("Todo deleted successfully");
      }
    });
  },
};

module.exports = TodoListController;
