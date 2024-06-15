import DatabaseService from '../database/database.service';
import { Database, NewTask, Task } from '../interfaces';

export default class TaskService {
  static createTask(taskData: NewTask): Task {
    const data: Database = DatabaseService.getData();
    const nextTaskId: string = `T${1 + Number(data.lastTaskId.slice(1))}`;
    const task: Task = { taskId: nextTaskId, ...taskData };

    data.tasks.push(task);
    data.lastTaskId = nextTaskId;
    DatabaseService.setData(data);

    return task;
  }

  static retrieveTask(taskId: string): Task {
    const data: Database = DatabaseService.getData();

    const task: Task | undefined = data.tasks.find((task: Task) => task.taskId === taskId);
    if (!task) throw new Error('Not Found');
    else return task;
  }

  static updateTask(taskId: string, taskData: Partial<Task>): Task {
    const data: Database = DatabaseService.getData();
    const taskIndex: number = data.tasks.findIndex((task: any) => task.taskId === taskId);
    if (taskIndex === -1) throw new Error('Not Found');
    const task: Task = { ...data.tasks[taskIndex], ...taskData };

    data.tasks[taskIndex] = task;
    DatabaseService.setData(data);

    return task;
  }

  static deleteTask(taskId: string): void {
    const data: Database = DatabaseService.getData();
    const totalRecords = data.tasks.length;

    data.tasks = data.tasks.filter((task: Task) => task.taskId !== taskId);
    if (totalRecords === data.tasks.length) throw new Error('Not Found');
    else DatabaseService.setData(data);
  }

  static completeTask(taskId: string): Task {
    const data: Database = DatabaseService.getData();
    const taskIndex: number = data.tasks.findIndex((task: Task) => task.taskId === taskId);

    if (taskIndex === -1) throw new Error('Not Found');
    else {
      data.tasks[taskIndex].isComplete = true;
      DatabaseService.setData(data);
      return data.tasks[taskIndex];
    }
  }
}
