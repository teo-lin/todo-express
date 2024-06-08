import DatabaseService from '../database/database.service';
import { Database, List, NewList } from '../interfaces';

export default class ListService {
  static createList(listData: NewList): List {
    const data: Database = DatabaseService.getData();
    const nextListId: string = `L${1 + Number(data.lastListId.slice(1))}`;
    const list: List = { listId: nextListId, ...listData };

    data.lists.push(list);
    data.lastListId = nextListId;
    DatabaseService.setData(data);

    return list;
  }

  static retrieveList(listId: string): List | undefined {
    const data: Database = DatabaseService.getData();

    const list: List | undefined = data.lists.find((list: List) => list.listId === listId);
    if (!list) throw new Error('Not Found');
    else return list;
  }

  static updateList(listId: string, listData: Partial<List>): List {
    const data: Database = DatabaseService.getData();
    const listIndex: number = data.lists.findIndex((list: any) => list.listId === listId);
    if (listIndex === -1) throw new Error('Not Found');
    const list: List = { ...data.lists[listIndex], ...listData };

    data.lists[listIndex] = list;
    DatabaseService.setData(data);

    return list;
  }

  static deleteList(listId: string): void {
    const data: Database = DatabaseService.getData();
    const totalRecords = data.lists.length;

    data.lists = data.lists.filter((list: List) => list.listId !== listId);
    if (totalRecords === data.lists.length) throw new Error('Not Found');
    else DatabaseService.setData(data);
  }
}
