const DatabaseService = require('../database/database.service')

class TaskService {
  static createTask(taskData) {
    const data = DatabaseService.getData()
    const nextTaskId = `T${1 + Number(data.lastTaskId.slice(1))}`
    const newTask = { taskId: nextTaskId, ...taskData }
    data.tasks.push(newTask)
    data.lastTaskId = nextTaskId
    DatabaseService.setData(data)
    return newTask
  }
  static retrieveTask(taskId) {
    const data = DatabaseService.getData()
    return data.tasks.find((task) => task.taskId === taskId)
  }
  static updateTask(taskId, taskData) {
    const data = DatabaseService.getData()
    const taskIndex = data.tasks.findIndex((task) => task.taskId === taskId)
    if (taskIndex === -1) throw new Error('Task not found')
    data.tasks[taskIndex] = { ...data.tasks[taskIndex], ...taskData }
    DatabaseService.setData(data)
    return data.tasks[taskIndex]
  }
  static deleteTask(taskId) {
    const data = DatabaseService.getData()
    data.tasks = data.tasks.filter((task) => task.taskId !== taskId)
    DatabaseService.setData(data)
  }
  static completeTask(taskId) {
    const data = DatabaseService.getData()
    const taskIndex = data.tasks.findIndex((task) => task.taskId === taskId)
    if (taskIndex === -1) throw new Error('Task not found')
    data.tasks[taskIndex].isComplete = true
    DatabaseService.setData(data)
    return data.tasks[taskIndex]
  }
}

module.exports = TaskService
