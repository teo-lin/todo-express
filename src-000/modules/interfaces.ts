export interface Database {
  lastUserId: string;
  lastListId: string;
  lastTaskId: string;
  users: User[];
  lists: List[];
  tasks: Task[];
}

export interface User {
  userId: string;
  username: string;
  password: string;
  fullname: string;
}

export interface List {
  listId: string;
  listName: string;
  isShared: boolean;
}

export interface Task {
  taskId: string;
  listId: string;
  userId: string;
  taskName: string;
  isComplete: boolean;
}

export interface NewUser extends Omit<User, 'userId'> {}
export interface MaskedUser extends Omit<User, 'password'> {}
export interface NewList extends Omit<List, 'listId'> {}
export interface NewTask extends Omit<Task, 'taskId'> {}
