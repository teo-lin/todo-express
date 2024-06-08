import DatabaseService from '../database/database.service';
import { Database, User, NewUser, MaskedUser } from '../interfaces';

export default class UserService {
  static createUser(userData: NewUser): MaskedUser {
    const data: Database = DatabaseService.getData();
    const nextUserId: string = `U${1 + Number(data.lastUserId.slice(1))}`;
    const user: User = { userId: nextUserId, ...userData };

    data.users.push(user);
    data.lastUserId = nextUserId;
    DatabaseService.setData(data);

    const { password, ...maskedUser } = user;
    return maskedUser;
  }

  static retrieveUser(userId: string): MaskedUser | undefined {
    const data: Database = DatabaseService.getData();
    const user: User | undefined = data.users.find((user: User) => user.userId === userId);

    if (!user) throw new Error('Not Found');
    else {
      const { password, ...maskedUser } = user;
      return maskedUser;
    }
  }

  static updateUser(userId: string, userData: Partial<User>): MaskedUser {
    const data: Database = DatabaseService.getData();
    const userIndex: number = data.users.findIndex((user: User) => user.userId === userId);
    if (userIndex === -1) throw new Error('Not Found');
    const user: User = { ...data.users[userIndex], ...userData };

    data.users[userIndex] = user;
    DatabaseService.setData(data);

    const { password, ...maskedUser } = user;
    return maskedUser;
  }

  static deleteUser(userId: string): void {
    const data: Database = DatabaseService.getData();
    const totalRecords = data.users.length;

    data.users = data.users.filter((user: User) => user.userId !== userId);
    if (totalRecords === data.users.length) throw new Error('Not Found');
    else DatabaseService.setData(data);
  }
}
