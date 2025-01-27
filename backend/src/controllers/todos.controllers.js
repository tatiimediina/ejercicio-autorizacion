import { database } from "../db/database.js";

export const getAllTodosCtrl = (req, res) => {
  const tasks = database.todos.filter((task) => task.owner === req.user.id);
  console.log(tasks);
  res.json(tasks);
};
export const deleteTodosCtrl = (req, res) => {
  const { id } = req.params;

  // Encontrar la tarea
  const taskIndex = database.todos.findIndex((task) => task.id == id);
  if (taskIndex === -1) {
    return res.status(404).json({ message: "Tarea no encontrada" });
  }

  const task = database.todos[taskIndex];

  if (task.owner !== req.user.id) {
    return res
      .status(403)
      .json({ message: "No tienes permiso para eliminar esta tarea" });
  }

  database.todos.splice(taskIndex, 1);

  res.json({ message: "Tarea eliminada correctamente" });
};
export const updateTodosCtrl = (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  const task = database.todos.find((task) => task.id == id);

  console.log(task);

  if (!task) {
    return res.status(404).json({ message: "Tarea no encontrada" });
  }

  if (task.owner !== req.user.id) {
    return res
      .status(403)
      .json({ message: "No tienes permiso para editar esta tarea" });
  }
  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "El título es requerido." });
  } else {
    task.title = title || task.title;
  }
  if (typeof completed !== "boolean") {
    return res
      .status(400)
      .json({ message: "El campo 'completed' debe ser un valor booleano." });
  } else {
    task.completed = completed || task.completed;
  }

  res.json({ message: "Tarea actualizada correctamente", task });
};
export const createTodoCtrl = (req, res) => {
  const { title, completed } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "El título es requerido." });
  }

  if (typeof completed !== "boolean") {
    return res
      .status(400)
      .json({ message: "El campo 'completed' debe ser un valor booleano." });
  }

  const newTodo = {
    id: database.todos.length + 1,
    owner: req.user.id,
    title: title.trim(),
    completed,
  };

  database.todos.push(newTodo);
  res.json({ message: "Tarea creada correctamente", newTodo });
};
