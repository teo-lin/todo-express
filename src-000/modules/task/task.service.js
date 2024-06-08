const DatabaseService = require('../database/database.service');

class TaskService {
  static createTask(taskData) {
    const data = DatabaseService.getData();
    const nextTaskId = `T${1 + Number(data.lastTaskId.slice(1))}`;
    const newTask = { taskId: nextTaskId, ...taskData };

    data.tasks.push(newTask);
    data.lastTaskId = nextTaskId;
    DatabaseService.setData(data);

    return newTask;
  }

  static retrieveTask(taskId) {
    const data = DatabaseService.getData();

    const task = data.tasks.find((task) => task.taskId === taskId);
    if (!task) throw new Error('Not Found');
    else return task;
  }

  static updateTask(taskId, taskData) {
    const data = DatabaseService.getData();
    const taskIndex = data.tasks.findIndex((task) => task.taskId === taskId);
    if (taskIndex === -1) throw new Error('Not Found');
    const updatedTask = { ...data.tasks[taskIndex], ...taskData };

    data.tasks[taskIndex] = updatedTask;
    DatabaseService.setData(data);

    return updatedTask;
  }

  static deleteTask(taskId) {
    const data = DatabaseService.getData();
    const totalRecords = data.tasks.length;

    data.tasks = data.tasks.filter((task) => task.taskId !== taskId);
    if (totalRecords === data.tasks.length) throw new Error('Not Found');
    else DatabaseService.setData(data);
  }

  static completeTask(taskId) {
    const data = DatabaseService.getData();
    const taskIndex = data.tasks.findIndex((task) => task.taskId === taskId);

    if (taskIndex === -1) throw new Error('Not Found');
    else {
      data.tasks[taskIndex].isComplete = true;
      DatabaseService.setData(data);
      return data.tasks[taskIndex];
    }
  }
}

module.exports = TaskService;
