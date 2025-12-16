import { ipcMain } from 'electron'
import {
  getRecommendationsForUser,
  getRecommendationsFromBook,
  getRecommendationsByPreferredGenres,
  getRecommendationsFromFollowing,
  getRecommendationsByFavoriteAuthors,
  getTrendingBooks,
  getHybridRecommendations
} from './recommendations.service'

ipcMain.handle('recommendations:forUser', async (_event, userId: string, limit?: number) => {
  return getRecommendationsForUser(userId, limit)
})

ipcMain.handle('recommendations:fromBook', async (_event, bookId: string, limit?: number) => {
  return getRecommendationsFromBook(bookId, limit)
})

ipcMain.handle('recommendations:byGenres', async (_event, userId: string, limit?: number) => {
  return getRecommendationsByPreferredGenres(userId, limit)
})

ipcMain.handle('recommendations:fromFollowing', async (_event, userId: string, limit?: number) => {
  return getRecommendationsFromFollowing(userId, limit)
})

ipcMain.handle('recommendations:byAuthors', async (_event, userId: string, limit?: number) => {
  return getRecommendationsByFavoriteAuthors(userId, limit)
})

ipcMain.handle('recommendations:trending', async (_event, limit?: number) => {
  return getTrendingBooks(limit)
})

ipcMain.handle('recommendations:hybrid', async (_event, userId: string, limit?: number) => {
  return getHybridRecommendations(userId, limit)
})
