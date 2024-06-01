import DatabaseService from '../database/database.service';
import { Request, Response } from 'express';
import { User, Database } from '../interfaces';

class UserService {
  static createUser(userData: Partial<User>): Partial<User> {
    const data: Database = DatabaseService.getData();
    const nextUserId = `U${1 + Number(data.lastUserId.slice(1))}`;
    const newUser: Partial<User> = { userId: nextUserId, ...userData };
    data.users.push(newUser as User);
    data.lastUserId = nextUserId;
    DatabaseService.setData(data);
    delete newUser.password;
    return newUser;
  }

  static retrieveUser(userId: string): Partial<User> | undefined {
    const data: Database = DatabaseService.getData();
    const user = data.users.find((user: User) => user.userId === userId);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return undefined;
  }

  static updateUser(userId: string, userData: Partial<User>): Partial<User> {
    const data: Database = DatabaseService.getData();
    const userIndex = data.users.findIndex((user: User) => user.userId === userId);
    if (userIndex === -1) throw new Error('User not found');
    data.users[userIndex] = { ...data.users[userIndex], ...userData };
    DatabaseService.setData(data);
    const user = data.users[userIndex];
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return user;
  }

  static deleteUser(userId: string): void {
    const data: Database = DatabaseService.getData();
    const updatedUsers = data.users.filter((user: User) => user.userId !== userId);
    data.users = updatedUsers;
    DatabaseService.setData(data);
  }
}

export default UserService;
