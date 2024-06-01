const DatabaseService = require('../database/database.service')

class ListService {
  static createList(listData) {
    const data = DatabaseService.getData()
    const nextListId = `L${1 + Number(data.lastListId.slice(1))}`
    const newList = { listId: nextListId, ...listData }
    data.lists.push(newList)
    data.lastListId = nextListId
    DatabaseService.setData(data)
    return newList
  }
  static retrieveList(listId) {
    const data = DatabaseService.getData()
    return data.lists.find((list) => list.listId === listId)
  }
  static updateList(listId, listData) {
    const data = DatabaseService.getData()
    const listIndex = data.lists.findIndex((list) => list.listId === listId)
    if (listIndex === -1) throw new Error('List not found')
    data.lists[listIndex] = { ...data.lists[listIndex], ...listData }
    DatabaseService.setData(data)
    return data.lists[listIndex]
  }
  static deleteList(listId) {
    const data = DatabaseService.getData()
    data.lists = data.lists.filter((list) => list.listId !== listId)
    DatabaseService.setData(data)
  }
}

module.exports = ListService
