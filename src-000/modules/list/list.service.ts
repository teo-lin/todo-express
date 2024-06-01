import DatabaseService from '../database/database.service';

class ListService {
  static createList(listData: any) {
    const data = DatabaseService.getData();
    const nextListId = `L${1 + Number(data.lastListId.slice(1))}`;
    const newList = { listId: nextListId, ...listData };
    data.lists.push(newList);
    data.lastListId = nextListId;
    DatabaseService.setData(data);
    return newList;
  }

  static retrieveList(listId: string) {
    const data = DatabaseService.getData();
    return data.lists.find((list: any) => list.listId === listId);
  }

  static updateList(listId: string, listData: any) {
    const data = DatabaseService.getData();
    const listIndex = data.lists.findIndex((list: any) => list.listId === listId);
    if (listIndex === -1) throw new Error('List not found');
    data.lists[listIndex] = { ...data.lists[listIndex], ...listData };
    DatabaseService.setData(data);
    return data.lists[listIndex];
  }

  static deleteList(listId: string) {
    const data = DatabaseService.getData();
    data.lists = data.lists.filter((list: any) => list.listId !== listId);
    DatabaseService.setData(data);
  }
}

export default ListService;
