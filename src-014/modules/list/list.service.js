const db = require('../database/database.service');

async function createList(listData) {
  const data = db.getData();
  const nextListId = `L${1 + Number(data.lastListId.slice(1))}`;
  const list = { listId: nextListId, ...listData };
  data.lists.push(list);
  data.lastListId = nextListId;
  db.setData(data);
  return list;
}

async function retrieveList(listId) {
  const data = db.getData();
  return data.lists.find((list) => list.listId === listId);
}

async function updateList(listId, listData) {
  const data = db.getData();
  const listIndex = data.lists.findIndex((list) => list.listId === listId);
  if (listIndex === -1) throw new Error('List not found');
  data.lists[listIndex] = { ...data.lists[listIndex], ...listData };
  db.setData(data);
  return data.lists[listIndex];
}

async function deleteList(listId) {
  const data = db.getData();
  data.lists = data.lists.filter((list) => list.listId !== listId);
  db.setData(data);
}

module.exports = { createList, retrieveList, updateList, deleteList };
