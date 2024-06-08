const DatabaseService = require('../database/database.service');

class UserService {
  static createUser(userData) {
    const data = DatabaseService.getData();
    const nextUserId = `U${1 + Number(data.lastUserId.slice(1))}`;
    const user = { userId: nextUserId, ...userData };

    data.users.push(user);
    data.lastUserId = nextUserId;
    DatabaseService.setData(data);

    const { password, ...maskedUser } = user;
    return maskedUser;
  }

  static retrieveUser(userId) {
    const data = DatabaseService.getData();
    const user = data.users.find((user) => user.userId === userId);

    if (!user) throw new Error('Not Found');
    else {
      const { password, ...maskedUser } = user;
      return maskedUser;
    }
  }

  static updateUser(userId, userData) {
    const data = DatabaseService.getData();
    const userIndex = data.users.findIndex((user) => user.userId === userId);
    if (userIndex === -1) throw new Error('Not Found');
    const user = { ...data.users[userIndex], ...userData };

    data.users[userIndex] = user;
    DatabaseService.setData(data);

    const { password, ...maskedUser } = user;
    return maskedUser;
  }

  static deleteUser(userId) {
    const data = DatabaseService.getData();
    const totalRecords = data.users.length;

    data.users = data.users.filter((user) => user.userId !== userId);
    if (totalRecords === data.users.length) throw new Error('Not Found');
    else DatabaseService.setData(data);
  }
}

module.exports = UserService;
