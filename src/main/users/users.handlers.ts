import { ipcMain } from 'electron'
import {
  getAllUsers,
  getUserById,
  getUserByUsername,
  createUser,
  updateUser,
  deleteUser,
  getUserReadingHistory,
  markBookAsRead,
  removeBookFromRead,
  getUserWishlist,
  addToWishlist,
  removeFromWishlist,
  followUser,
  unfollowUser,
  getUserFollowers,
  getUserFollowing,
  updateUserPreferredGenres
} from './users.service'

ipcMain.handle('users:getAll', async () => {
  return getAllUsers()
})

ipcMain.handle('users:getById', async (_event, id: string) => {
  return getUserById(id)
})

ipcMain.handle('users:getByUsername', async (_event, username: string) => {
  return getUserByUsername(username)
})

ipcMain.handle(
  'users:create',
  async (
    _event,
    user: {
      username: string
      email: string
      preferredGenres: string[]
    }
  ) => {
    return createUser(user)
  }
)

ipcMain.handle(
  'users:update',
  async (
    _event,
    id: string,
    updates: Partial<{
      username: string
      email: string
      preferredGenres: string[]
    }>
  ) => {
    return updateUser(id, updates)
  }
)

ipcMain.handle('users:delete', async (_event, id: string) => {
  return deleteUser(id)
})

ipcMain.handle('users:getReadingHistory', async (_event, userId: string) => {
  return getUserReadingHistory(userId)
})

ipcMain.handle(
  'users:markBookAsRead',
  async (_event, userId: string, bookId: string, rating: number, review?: string) => {
    return markBookAsRead(userId, bookId, rating, review)
  }
)

ipcMain.handle('users:removeBookFromRead', async (_event, userId: string, bookId: string) => {
  return removeBookFromRead(userId, bookId)
})

ipcMain.handle('users:getWishlist', async (_event, userId: string) => {
  return getUserWishlist(userId)
})

ipcMain.handle('users:addToWishlist', async (_event, userId: string, bookId: string) => {
  return addToWishlist(userId, bookId)
})

ipcMain.handle('users:removeFromWishlist', async (_event, userId: string, bookId: string) => {
  return removeFromWishlist(userId, bookId)
})

ipcMain.handle('users:follow', async (_event, followerId: string, followedId: string) => {
  return followUser(followerId, followedId)
})

ipcMain.handle('users:unfollow', async (_event, followerId: string, followedId: string) => {
  return unfollowUser(followerId, followedId)
})

ipcMain.handle('users:getFollowers', async (_event, userId: string) => {
  return getUserFollowers(userId)
})

ipcMain.handle('users:getFollowing', async (_event, userId: string) => {
  return getUserFollowing(userId)
})

ipcMain.handle('users:updatePreferredGenres', async (_event, userId: string, genres: string[]) => {
  return updateUserPreferredGenres(userId, genres)
})
