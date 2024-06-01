import DatabaseService from '../database/database.service';

class TaskService {
  static createTask(taskData: any): any {
    const data = DatabaseService.getData();
    const nextTaskId = `T${1 + Number(data.lastTaskId.slice(1))}`;
    const newTask = { taskId: nextTaskId, ...taskData };
    data.tasks.push(newTask);
    data.lastTaskId = nextTaskId;
    DatabaseService.setData(data);
    return newTask;
  }

  static retrieveTask(taskId: string): any | undefined {
    const data = DatabaseService.getData();
    return data.tasks.find((task: any) => task.taskId === taskId);
  }

  static updateTask(taskId: string, taskData: any): any {
    const data = DatabaseService.getData();
    const taskIndex = data.tasks.findIndex((task: any) => task.taskId === taskId);
    if (taskIndex === -1) throw new Error('Task not found');
    data.tasks[taskIndex] = { ...data.tasks[taskIndex], ...taskData };
    DatabaseService.setData(data);
    return data.tasks[taskIndex];
  }

  static deleteTask(taskId: string): void {
    const data = DatabaseService.getData();
    data.tasks = data.tasks.filter((task: any) => task.taskId !== taskId);
    DatabaseService.setData(data);
  }

  static completeTask(taskId: string): any {
    const data = DatabaseService.getData();
    const taskIndex = data.tasks.findIndex((task: any) => task.taskId === taskId);
    if (taskIndex === -1) throw new Error('Task not found');
    data.tasks[taskIndex].isComplete = true;
    DatabaseService.setData(data);
    return data.tasks[taskIndex];
  }
}

export default TaskService;
