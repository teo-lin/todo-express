import DatabaseService from '../database/database.service';
import { Database, NewTask, Task } from '../interfaces';

class TaskService {
  static createTask(taskData: NewTask): Task {
    const data: Database = DatabaseService.getData();
    const nextTaskId: string = `T${1 + Number(data.lastTaskId.slice(1))}`;
    const newTask: Task = { taskId: nextTaskId, ...taskData };

    data.tasks.push(newTask);
    data.lastTaskId = nextTaskId;
    DatabaseService.setData(data);

    return newTask;
  }

  static retrieveTask(taskId: string): Task | undefined {
    const data: Database = DatabaseService.getData();

    return data.tasks.find((task: Task) => task.taskId === taskId);
  }

  static updateTask(taskId: string, taskData: Partial<Task>): Task {
    const data: Database = DatabaseService.getData();
    const taskIndex: number = data.tasks.findIndex((task: any) => task.taskId === taskId);
    if (taskIndex === -1) throw new Error('Task not found');
    const updatedTask: Task = { ...data.tasks[taskIndex], ...taskData };

    data.tasks[taskIndex] = updatedTask;
    DatabaseService.setData(data);

    return updatedTask;
  }

  static deleteTask(taskId: string): void {
    const data: Database = DatabaseService.getData();
    data.tasks = data.tasks.filter((task: Task) => task.taskId !== taskId);
    DatabaseService.setData(data);
  }

  static completeTask(taskId: string): Task {
    const data: Database = DatabaseService.getData();
    const taskIndex: number = data.tasks.findIndex((task: Task) => task.taskId === taskId);
    if (taskIndex === -1) throw new Error('Task not found');
    data.tasks[taskIndex].isComplete = true;

    DatabaseService.setData(data);
    return data.tasks[taskIndex];
  }
}

export default TaskService;
