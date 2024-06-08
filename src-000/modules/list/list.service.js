const DatabaseService = require('../database/database.service');

class ListService {
  static createList(listData) {
    const data = DatabaseService.getData();
    const nextListId = `L${1 + Number(data.lastListId.slice(1))}`;
    const newList = { listId: nextListId, ...listData };

    data.lists.push(newList);
    data.lastListId = nextListId;
    DatabaseService.setData(data);

    return newList;
  }

  static retrieveList(listId) {
    const data = DatabaseService.getData();

    const list = data.lists.find((list) => list.listId === listId);
    if (!list) throw new Error('Not Found');
    else return list;
  }

  static updateList(listId, listData) {
    const data = DatabaseService.getData();
    const listIndex = data.lists.findIndex((list) => list.listId === listId);
    if (listIndex === -1) throw new Error('Not Found');
    const updatedList = { ...data.lists[listIndex], ...listData };

    data.lists[listIndex] = updatedList;
    DatabaseService.setData(data);

    return updatedList;
  }

  static deleteList(listId) {
    const data = DatabaseService.getData();
    const totalRecords = data.lists.length;

    data.lists = data.lists.filter((list) => list.listId !== listId);
    if (totalRecords === data.lists.length) throw new Error('Not Found');
    else DatabaseService.setData(data);
  }
}

module.exports = ListService;
