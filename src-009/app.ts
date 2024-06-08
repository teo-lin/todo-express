import express, { Express, Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

// INTERFACES
interface Database {
  lastUserId: string;
  lastListId: string;
  lastTaskId: string;
  users: User[];
  lists: List[];
  tasks: Task[];
}
interface User {
  userId: string;
  username: string;
  password: string;
  fullname: string;
}
interface List {
  listId: string;
  listName: string;
  isShared: boolean;
}
interface Task {
  taskId: string;
  listId: string;
  userId: string;
  taskName: string;
  isComplete: boolean;
}
type Method = (req: Request) => Promise<unknown>;
type Entity = 'User' | 'List' | 'Task';

// CONTROLLERS
abstract class BaseController {
  static handleRequest(method: Method, code: number = 200, message?: string | undefined) {
    return async (req: Request, res: Response) => {
      try {
        const result = await method(req);
        if (message) return res.status(code).json({ message });
        res.status(code).json(result);
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
    };
  }
}

class UserController extends BaseController {
  static createUser = BaseController.handleRequest((req) => UserService.createUser(req.body), 201);

  static retrieveUser = BaseController.handleRequest((req) =>
    UserService.retrieveUser(req.params.id)
  );

  static updateUser = BaseController.handleRequest((req) =>
    UserService.updateUser(req.params.id, req.body)
  );

  static deleteUser = BaseController.handleRequest(
    (req) => UserService.deleteUser(req.params.id),
    200,
    'User deleted successfully'
  );
}
class TaskController extends BaseController {
  static createTask = BaseController.handleRequest((req) => TaskService.createTask(req.body), 201);

  static retrieveTask = BaseController.handleRequest((req) =>
    TaskService.retrieveTask(req.params.id)
  );

  static updateTask = BaseController.handleRequest((req) =>
    TaskService.updateTask(req.params.id, req.body)
  );

  static deleteTask = BaseController.handleRequest(
    (req) => TaskService.deleteTask(req.params.id),
    200,
    'Task deleted successfully'
  );

  static completeTask = BaseController.handleRequest((req) =>
    TaskService.completeTask(req.params.id)
  );
}
class ListController extends BaseController {
  static createList = BaseController.handleRequest((req) => ListService.createList(req.body), 201);

  static retrieveList = BaseController.handleRequest((req) =>
    ListService.retrieveList(req.params.id)
  );

  static updateList = BaseController.handleRequest((req) =>
    ListService.updateList(req.params.id, req.body)
  );

  static deleteList = BaseController.handleRequest(
    (req) => ListService.deleteList(req.params.id),
    200,
    'List deleted successfully'
  );
}

// SERVICES
abstract class BaseService {
  static generateNextId(data: Database, lastIdKey: keyof Database): string {
    const lastId = data[lastIdKey] as string;
    const nextId = `${lastIdKey.charAt(4)}${1 + Number(lastId.slice(1))}`;
    (data[lastIdKey as keyof Database] as string) = nextId;
    return nextId;
  }

  static create<T>(entityData: Partial<T>, entityType: Entity): T {
    const data = DatabaseService.getData();
    const entityName = `${entityType.toLowerCase()}s` as keyof Database;
    const entityId = `${entityType.toLowerCase()}Id`;

    const lastIdKey = `last${entityType}Id` as keyof Database;
    const nextId = this.generateNextId(data, lastIdKey);
    const newEntity = { [entityId]: nextId, ...entityData } as T;

    (data[entityName] as Array<any>).push(newEntity);
    DatabaseService.setData(data);
    return newEntity;
  }

  static retrieve<T>(id: string, entityType: Entity): T | undefined {
    const data = DatabaseService.getData();
    const entityName = `${entityType.toLowerCase()}s` as keyof Database;
    const entityId = `${entityType.toLowerCase()}Id`;

    return (data[entityName] as Array<any>).find((entity) => entity[entityId] === id);
  }

  static update<T>(id: string, entityData: Partial<T>, entityType: Entity): T {
    const data = DatabaseService.getData();
    const entityName = `${entityType.toLowerCase()}s` as keyof Database;
    const entityId = `${entityType.toLowerCase()}Id`;

    const entities = data[entityName] as Array<any>;
    const entityIndex = entities.findIndex((entity) => entity[entityId] === id);
    if (entityIndex === -1) throw new Error(`${entityName} not found`);

    entities[entityIndex] = { ...entities[entityIndex], ...entityData };
    DatabaseService.setData(data);
    return entities[entityIndex];
  }

  static delete(id: string, entityType: Entity): void {
    const data = DatabaseService.getData();
    const entityName = `${entityType.toLowerCase()}s` as keyof Database;
    const entityId = `${entityType.toLowerCase()}Id`;

    (data[entityName] as Array<any>) = (data[entityName] as Array<any>).filter(
      (entity) => entity[entityId] !== id
    );
    DatabaseService.setData(data);
  }
}

class UserService extends BaseService {
  static async createUser(userData: Partial<User>): Promise<Partial<User>> {
    const user = super.create<User>(userData, 'User');
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async retrieveUser(userId: string): Promise<Partial<User> | undefined> {
    const user = super.retrieve<User>(userId, 'User');
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return user;
  }

  static async updateUser(userId: string, userData: Partial<User>): Promise<Partial<User>> {
    const user = super.update<User>(userId, userData, 'User');
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async deleteUser(userId: string): Promise<void> {
    super.delete(userId, 'User');
  }
}
class ListService extends BaseService {
  static async createList(listData: Partial<List>): Promise<List> {
    return super.create<List>(listData, 'List');
  }

  static async retrieveList(listId: string): Promise<List | undefined> {
    return super.retrieve<List>(listId, 'List');
  }

  static async updateList(listId: string, listData: Partial<List>): Promise<List> {
    return super.update<List>(listId, listData, 'List');
  }

  static async deleteList(listId: string): Promise<void> {
    super.delete(listId, 'List');
  }
}
class TaskService extends BaseService {
  static async createTask(taskData: Partial<Task>): Promise<Task> {
    return super.create<Task>(taskData, 'Task');
  }

  static async retrieveTask(taskId: string): Promise<Task | undefined> {
    return super.retrieve<Task>(taskId, 'Task');
  }

  static async updateTask(taskId: string, taskData: Partial<Task>): Promise<Task> {
    return super.update<Task>(taskId, taskData, 'Task');
  }

  static async deleteTask(taskId: string): Promise<void> {
    super.delete(taskId, 'Task');
  }

  static async completeTask(taskId: string): Promise<Task> {
    const data = DatabaseService.getData();
    const taskIndex = data.tasks.findIndex((task: Task) => task.taskId === taskId);
    if (taskIndex === -1) throw new Error('Task not found');
    data.tasks[taskIndex].isComplete = true;
    DatabaseService.setData(data);
    return data.tasks[taskIndex];
  }
}

class DatabaseService {
  private static db: Database;
  private static filePath = path.join(__dirname, './db.json');

  static init(): void {
    this.db = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
  }

  static getData(): Database {
    return this.db;
  }

  static setData(data: Database): void {
    this.db = data;
  }

  static saveToDisk(): void {
    fs.writeFileSync(this.filePath, JSON.stringify(this.db), 'utf8');
  }
}

// DATABASE
DatabaseService.init();

// ROUTER
const app: Express = express();
const router: Router = express.Router();

// MIDDLEWARE
app.use(express.json());
app.use('/api', router);

// ROUTES
router.post('/users/register', UserController.createUser);
router.get('/users/user/:id', UserController.retrieveUser);
router.put('/users/user/:id', UserController.updateUser);
router.delete('/users/user/:id', UserController.deleteUser);
router.post('/tasks/create', TaskController.createTask);
router.get('/tasks/task/:id', TaskController.retrieveTask);
router.put('/tasks/task/:id', TaskController.updateTask);
router.delete('/tasks/task/:id', TaskController.deleteTask);
router.patch('/tasks/task/:id/complete', TaskController.completeTask);
router.post('/lists/create', ListController.createList);
router.get('/lists/list/:id', ListController.retrieveList);
router.put('/lists/list/:id', ListController.updateList);
router.delete('/lists/list/:id', ListController.deleteList);

// SERVER
const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
