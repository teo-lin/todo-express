const data = require('../database/database.service');

function createUser(userData) {
  const nextUserId = `U${1 + Number(data.lastUserId.slice(1))}`;
  const user = { userId: nextUserId, ...userData };

  data.users.push(user);
  data.lastUserId = nextUserId;

  const { password, ...maskedUser } = user;
  return maskedUser;
}

function retrieveUser(userId) {
  const user = data.users.find((user) => user.userId === userId);

  if (!user) throw new Error('Not Found');
  else {
    const { password, ...maskedUser } = user;
    return maskedUser;
  }
}

function updateUser(userId, userData) {
  const userIndex = data.users.findIndex((user) => user.userId === userId);
  if (userIndex === -1) throw new Error('Not Found');
  const user = { ...data.users[userIndex], ...userData };

  data.users[userIndex] = user;

  const { password, ...maskedUser } = user;
  return maskedUser;
}

function deleteUser(userId) {
  const totalRecords = data.users.length;

  data.users = data.users.filter((user) => user.userId !== userId);
  if (totalRecords === data.users.length) throw new Error('Not Found');
}

module.exports = {
  createUser,
  retrieveUser,
  updateUser,
  deleteUser,
};
