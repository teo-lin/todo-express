const DatabaseService = require('../database/database.service');

class ListService {
  static createList(listData) {
    const data = DatabaseService.getData();
    const nextListId = `L${1 + Number(data.lastListId.slice(1))}`;
    const list = { listId: nextListId, ...listData };

    data.lists.push(list);
    data.lastListId = nextListId;
    DatabaseService.setData(data);

    return list;
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
    const list = { ...data.lists[listIndex], ...listData };

    data.lists[listIndex] = list;
    DatabaseService.setData(data);

    return list;
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
