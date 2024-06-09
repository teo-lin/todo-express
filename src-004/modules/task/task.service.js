const data = require('../database/database.service');

function createTask(taskData) {
  const nextTaskId = `T${1 + Number(data.lastTaskId.slice(1))}`;
  const task = { taskId: nextTaskId, ...taskData };

  data.tasks.push(task);
  data.lastTaskId = nextTaskId;

  return task;
}

function retrieveTask(taskId) {
  const task = data.tasks.find((task) => task.taskId === taskId);
  if (!task) throw new Error('Not Found');
  else return task;
}

function updateTask(taskId, taskData) {
  const taskIndex = data.tasks.findIndex((task) => task.taskId === taskId);
  if (taskIndex === -1) throw new Error('Not Found');
  const task = { ...data.tasks[taskIndex], ...taskData };

  data.tasks[taskIndex] = task;

  return task;
}

function deleteTask(taskId) {
  const totalRecords = data.tasks.length;

  data.tasks = data.tasks.filter((task) => task.taskId !== taskId);
  if (totalRecords === data.tasks.length) throw new Error('Not Found');
}

function completeTask(taskId) {
  const taskIndex = data.tasks.findIndex((task) => task.taskId === taskId);

  if (taskIndex === -1) throw new Error('Not Found');
  else {
    data.tasks[taskIndex].isComplete = true;
    return data.tasks[taskIndex];
  }
}

module.exports = {
  createTask,
  retrieveTask,
  updateTask,
  deleteTask,
  completeTask
};
