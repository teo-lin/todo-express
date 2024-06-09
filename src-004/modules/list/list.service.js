const data = require('../database/database.service');

function createList(listData) {
  const nextListId = `L${1 + Number(data.lastListId.slice(1))}`;
  const list = { listId: nextListId, ...listData };

  data.lists.push(list);
  data.lastListId = nextListId;

  return list;
}

function retrieveList(listId) {
  const list = data.lists.find((list) => list.listId === listId);
  if (!list) throw new Error('Not Found');
  else return list;
}

function updateList(listId, listData) {
  const listIndex = data.lists.findIndex((list) => list.listId === listId);
  if (listIndex === -1) throw new Error('Not Found');
  const list = { ...data.lists[listIndex], ...listData };

  data.lists[listIndex] = list;

  return list;
}

function deleteList(listId) {
  const totalRecords = data.lists.length;

  data.lists = data.lists.filter((list) => list.listId !== listId);
  if (totalRecords === data.lists.length) throw new Error('Not Found');
}

function completeList(listId) {
  const listIndex = data.lists.findIndex((list) => list.listId === listId);

  if (listIndex === -1) throw new Error('Not Found');
  else {
    data.lists[listIndex].isComplete = true;
    return data.lists[listIndex];
  }
}

module.exports = {
  createList,
  retrieveList,
  updateList,
  deleteList,
  completeList,
};
