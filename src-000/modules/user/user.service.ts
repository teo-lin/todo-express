import DatabaseService from '../database/database.service';
import { Database, User, NewUser, MaskedUser } from '../interfaces';

class UserService {
  static createUser(userData: NewUser): MaskedUser {
    const data: Database = DatabaseService.getData();
    const nextUserId: string = `U${1 + Number(data.lastUserId.slice(1))}`;
    const newUser: User = { userId: nextUserId, ...userData };

    data.users.push(newUser);
    data.lastUserId = nextUserId;
    DatabaseService.setData(data);

    const { password, ...maskedUser } = newUser;
    return maskedUser;
  }

  static retrieveUser(userId: string): MaskedUser | undefined {
    const data: Database = DatabaseService.getData();
    const user: User | undefined = data.users.find((user: User) => user.userId === userId);

    if (user) {
      const { password, ...maskedUser } = user;
      return maskedUser;
    }
  }

  static updateUser(userId: string, userData: Partial<User>): MaskedUser {
    const data: Database = DatabaseService.getData();
    const userIndex: number = data.users.findIndex((user: User) => user.userId === userId);
    if (userIndex === -1) throw new Error('User not found');
    const updatedUser: User = { ...data.users[userIndex], ...userData };

    data.users[userIndex] = updatedUser;
    DatabaseService.setData(data);

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  static deleteUser(userId: string): void {
    const data: Database = DatabaseService.getData();
    data.users = data.users.filter((user: User) => user.userId !== userId);
    DatabaseService.setData(data);
  }
}

export default UserService;
