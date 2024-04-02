const express = require("express");
const router = express.Router();
const TodoListController = require("../controllers/TodoListController");
router.get("/", TodoListController.getAllTodos);
router.post("/", TodoListController.addTodo);
router.delete("/:id", TodoListController.deleteTodo);

module.exports = router;
