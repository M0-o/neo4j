import { ipcMain } from 'electron'
import {
  getAllAuthors,
  getAuthorById,
  searchAuthors,
  getAuthorsByNationality,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  getTopAuthors
} from './authors.service'

ipcMain.handle('authors:getAll', async () => {
  return getAllAuthors()
})

ipcMain.handle('authors:getById', async (_event, id: string) => {
  return getAuthorById(id)
})

ipcMain.handle('authors:search', async (_event, query: string) => {
  return searchAuthors(query)
})

ipcMain.handle('authors:getByNationality', async (_event, nationality: string) => {
  return getAuthorsByNationality(nationality)
})

ipcMain.handle(
  'authors:create',
  async (
    _event,
    author: {
      name: string
      birthYear: number
      nationality: string
    }
  ) => {
    return createAuthor(author)
  }
)

ipcMain.handle(
  'authors:update',
  async (
    _event,
    id: string,
    updates: Partial<{
      name: string
      birthYear: number
      nationality: string
    }>
  ) => {
    return updateAuthor(id, updates)
  }
)

ipcMain.handle('authors:delete', async (_event, id: string) => {
  return deleteAuthor(id)
})

ipcMain.handle('authors:getTop', async (_event, limit?: number) => {
  return getTopAuthors(limit)
})
