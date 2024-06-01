import DatabaseService from '../database/database.service';
import { Database, List, NewList } from '../interfaces';

class ListService {
  static createList(listData: NewList): List {
    const data: Database = DatabaseService.getData();
    const nextListId: string = `L${1 + Number(data.lastListId.slice(1))}`;
    const newList: List = { listId: nextListId, ...listData };

    data.lists.push(newList);
    data.lastListId = nextListId;
    DatabaseService.setData(data);

    return newList;
  }

  static retrieveList(listId: string): List | undefined {
    const data: Database = DatabaseService.getData();

    return data.lists.find((list: List) => list.listId === listId);
  }

  static updateList(listId: string, listData: Partial<List>): List {
    const data: Database = DatabaseService.getData();
    const listIndex: number = data.lists.findIndex((list: any) => list.listId === listId);
    if (listIndex === -1) throw new Error('List not found');
    const updatedList: List = { ...data.lists[listIndex], ...listData };

    data.lists[listIndex] = updatedList;
    DatabaseService.setData(data);

    return updatedList;
  }

  static deleteList(listId: string): void {
    const data: Database = DatabaseService.getData();
    data.lists = data.lists.filter((list: List) => list.listId !== listId);
    DatabaseService.setData(data);
  }
}

export default ListService;
