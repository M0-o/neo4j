import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// API definitions for type safety
const api = {
  // Database
  db: {
    seed: () => ipcRenderer.invoke('db:seed')
  },

  // Books
  books: {
    getAll: () => ipcRenderer.invoke('books:getAll'),
    getById: (id: string) => ipcRenderer.invoke('books:getById', id),
    search: (query: string) => ipcRenderer.invoke('books:search', query),
    getByGenre: (genreId: string) => ipcRenderer.invoke('books:getByGenre', genreId),
    getByAuthor: (authorId: string) => ipcRenderer.invoke('books:getByAuthor', authorId),
    getSimilar: (bookId: string, limit?: number) =>
      ipcRenderer.invoke('books:getSimilar', bookId, limit),
    getTopRated: (limit?: number) => ipcRenderer.invoke('books:getTopRated', limit),
    create: (book: {
      title: string
      publishedYear: number
      pages: number
      isbn: string
      rating: number
      description: string
    }) => ipcRenderer.invoke('books:create', book),
    update: (
      id: string,
      updates: Partial<{
        title: string
        publishedYear: number
        pages: number
        isbn: string
        rating: number
        description: string
      }>
    ) => ipcRenderer.invoke('books:update', id, updates),
    delete: (id: string) => ipcRenderer.invoke('books:delete', id)
  },

  // Authors
  authors: {
    getAll: () => ipcRenderer.invoke('authors:getAll'),
    getById: (id: string) => ipcRenderer.invoke('authors:getById', id),
    search: (query: string) => ipcRenderer.invoke('authors:search', query),
    getByNationality: (nationality: string) =>
      ipcRenderer.invoke('authors:getByNationality', nationality),
    getTop: (limit?: number) => ipcRenderer.invoke('authors:getTop', limit),
    create: (author: { name: string; birthYear: number; nationality: string }) =>
      ipcRenderer.invoke('authors:create', author),
    update: (
      id: string,
      updates: Partial<{ name: string; birthYear: number; nationality: string }>
    ) => ipcRenderer.invoke('authors:update', id, updates),
    delete: (id: string) => ipcRenderer.invoke('authors:delete', id)
  },

  // Genres
  genres: {
    getAll: () => ipcRenderer.invoke('genres:getAll'),
    getById: (id: string) => ipcRenderer.invoke('genres:getById', id),
    getWithStats: () => ipcRenderer.invoke('genres:getWithStats'),
    search: (query: string) => ipcRenderer.invoke('genres:search', query),
    getPopular: (limit?: number) => ipcRenderer.invoke('genres:getPopular', limit),
    create: (genre: { name: string; description: string }) =>
      ipcRenderer.invoke('genres:create', genre),
    update: (id: string, updates: Partial<{ name: string; description: string }>) =>
      ipcRenderer.invoke('genres:update', id, updates),
    delete: (id: string) => ipcRenderer.invoke('genres:delete', id)
  },

  // Users
  users: {
    getAll: () => ipcRenderer.invoke('users:getAll'),
    getById: (id: string) => ipcRenderer.invoke('users:getById', id),
    getByUsername: (username: string) => ipcRenderer.invoke('users:getByUsername', username),
    create: (user: { username: string; email: string; preferredGenres: string[] }) =>
      ipcRenderer.invoke('users:create', user),
    update: (
      id: string,
      updates: Partial<{ username: string; email: string; preferredGenres: string[] }>
    ) => ipcRenderer.invoke('users:update', id, updates),
    delete: (id: string) => ipcRenderer.invoke('users:delete', id),
    getReadingHistory: (userId: string) => ipcRenderer.invoke('users:getReadingHistory', userId),
    markBookAsRead: (userId: string, bookId: string, rating: number, review?: string) =>
      ipcRenderer.invoke('users:markBookAsRead', userId, bookId, rating, review),
    removeBookFromRead: (userId: string, bookId: string) =>
      ipcRenderer.invoke('users:removeBookFromRead', userId, bookId),
    getWishlist: (userId: string) => ipcRenderer.invoke('users:getWishlist', userId),
    addToWishlist: (userId: string, bookId: string) =>
      ipcRenderer.invoke('users:addToWishlist', userId, bookId),
    removeFromWishlist: (userId: string, bookId: string) =>
      ipcRenderer.invoke('users:removeFromWishlist', userId, bookId),
    follow: (followerId: string, followedId: string) =>
      ipcRenderer.invoke('users:follow', followerId, followedId),
    unfollow: (followerId: string, followedId: string) =>
      ipcRenderer.invoke('users:unfollow', followerId, followedId),
    getFollowers: (userId: string) => ipcRenderer.invoke('users:getFollowers', userId),
    getFollowing: (userId: string) => ipcRenderer.invoke('users:getFollowing', userId),
    updatePreferredGenres: (userId: string, genres: string[]) =>
      ipcRenderer.invoke('users:updatePreferredGenres', userId, genres)
  },

  // Recommendations
  recommendations: {
    forUser: (userId: string, limit?: number) =>
      ipcRenderer.invoke('recommendations:forUser', userId, limit),
    fromBook: (bookId: string, limit?: number) =>
      ipcRenderer.invoke('recommendations:fromBook', bookId, limit),
    byGenres: (userId: string, limit?: number) =>
      ipcRenderer.invoke('recommendations:byGenres', userId, limit),
    fromFollowing: (userId: string, limit?: number) =>
      ipcRenderer.invoke('recommendations:fromFollowing', userId, limit),
    byAuthors: (userId: string, limit?: number) =>
      ipcRenderer.invoke('recommendations:byAuthors', userId, limit),
    trending: (limit?: number) => ipcRenderer.invoke('recommendations:trending', limit),
    hybrid: (userId: string, limit?: number) =>
      ipcRenderer.invoke('recommendations:hybrid', userId, limit)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
