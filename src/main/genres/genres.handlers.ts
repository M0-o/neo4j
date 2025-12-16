import { ipcMain } from 'electron'
import {
  getAllGenres,
  getGenreById,
  getGenresWithStats,
  searchGenres,
  createGenre,
  updateGenre,
  deleteGenre,
  getPopularGenres
} from './genres.service'

ipcMain.handle('genres:getAll', async () => {
  return getAllGenres()
})

ipcMain.handle('genres:getById', async (_event, id: string) => {
  return getGenreById(id)
})

ipcMain.handle('genres:getWithStats', async () => {
  return getGenresWithStats()
})

ipcMain.handle('genres:search', async (_event, query: string) => {
  return searchGenres(query)
})

ipcMain.handle(
  'genres:create',
  async (
    _event,
    genre: {
      name: string
      description: string
    }
  ) => {
    return createGenre(genre)
  }
)

ipcMain.handle(
  'genres:update',
  async (
    _event,
    id: string,
    updates: Partial<{
      name: string
      description: string
    }>
  ) => {
    return updateGenre(id, updates)
  }
)

ipcMain.handle('genres:delete', async (_event, id: string) => {
  return deleteGenre(id)
})

ipcMain.handle('genres:getPopular', async (_event, limit?: number) => {
  return getPopularGenres(limit)
})
