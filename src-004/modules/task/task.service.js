const db = require('../database/database.service');

async function createTask(taskData) {
  const data = db.getData();
  const nextTaskId = `T${1 + Number(data.lastTaskId.slice(1))}`;
  const task = { taskId: nextTaskId, ...taskData };
  data.tasks.push(task);
  data.lastTaskId = nextTaskId;
  db.setData(data);
  return task;
}

async function retrieveTask(taskId) {
  const data = db.getData();
  return data.tasks.find((task) => task.taskId === taskId);
}

async function updateTask(taskId, taskData) {
  const data = db.getData();
  const taskIndex = data.tasks.findIndex((task) => task.taskId === taskId);
  if (taskIndex === -1) throw new Error('Task not found');
  data.tasks[taskIndex] = { ...data.tasks[taskIndex], ...taskData };
  db.setData(data);
  return data.tasks[taskIndex];
}

async function deleteTask(taskId) {
  const data = db.getData();
  data.tasks = data.tasks.filter((task) => task.taskId !== taskId);
  db.setData(data);
}

async function completeTask(taskId) {
  const data = db.getData();
  const taskIndex = data.tasks.findIndex((task) => task.taskId === taskId);
  if (taskIndex === -1) throw new Error('Task not found');
  data.tasks[taskIndex].isComplete = true;
  db.setData(data);
  return data.tasks[taskIndex];
}

module.exports = { createTask, retrieveTask, updateTask, deleteTask, completeTask };
