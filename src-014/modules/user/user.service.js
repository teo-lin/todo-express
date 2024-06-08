const db = require('../database/database.service');

async function createUser(userData) {
  const data = db.getData();
  const nextUserId = `U${1 + Number(data.lastUserId.slice(1))}`;
  const user = { userId: nextUserId, ...userData };
  data.users.push(user);
  data.lastUserId = nextUserId;
  db.setData(data);
  delete user.password;
  return user;
}

async function retrieveUser(userId) {
  const data = db.getData();
  const user = data.users.find((user) => user.userId === userId);
  delete user.password;
  return user;
}

async function updateUser(userId, userData) {
  const data = db.getData();
  const userIndex = data.users.findIndex((user) => user.userId === userId);
  if (userIndex === -1) throw new Error('User not found');
  data.users[userIndex] = { ...data.users[userIndex], ...userData };
  db.setData(data);
  const user = data.users[userIndex];
  delete user.password;
  return user;
}

async function deleteUser(userId) {
  const data = db.getData();
  data.users = data.users.filter((user) => user.userId !== userId);
  db.setData(data);
}

module.exports = { createUser, retrieveUser, updateUser, deleteUser };
