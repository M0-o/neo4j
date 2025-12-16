import { ipcMain } from 'electron'
import {
  getAllBooks,
  getBookById,
  searchBooks,
  getBooksByGenre,
  getBooksByAuthor,
  getSimilarBooks,
  createBook,
  updateBook,
  deleteBook,
  addBookToGenre,
  setBookAuthor,
  getTopRatedBooks
} from './books.service'

ipcMain.handle('books:getAll', async () => {
  return getAllBooks()
})

ipcMain.handle('books:getById', async (_event, id: string) => {
  return getBookById(id)
})

ipcMain.handle('books:search', async (_event, query: string) => {
  return searchBooks(query)
})

ipcMain.handle('books:getByGenre', async (_event, genreId: string) => {
  return getBooksByGenre(genreId)
})

ipcMain.handle('books:getByAuthor', async (_event, authorId: string) => {
  return getBooksByAuthor(authorId)
})

ipcMain.handle('books:getSimilar', async (_event, bookId: string, limit?: number) => {
  return getSimilarBooks(bookId, limit)
})

ipcMain.handle(
  'books:create',
  async (
    _event,
    book: {
      title: string
      publishedYear: number
      pages: number
      isbn: string
      rating: number
      description: string
    }
  ) => {
    return createBook(book)
  }
)

ipcMain.handle(
  'books:update',
  async (
    _event,
    id: string,
    updates: Partial<{
      title: string
      publishedYear: number
      pages: number
      isbn: string
      rating: number
      description: string
    }>
  ) => {
    return updateBook(id, updates)
  }
)

ipcMain.handle('books:delete', async (_event, id: string) => {
  return deleteBook(id)
})

ipcMain.handle('books:addToGenre', async (_event, bookId: string, genreId: string) => {
  return addBookToGenre(bookId, genreId)
})

ipcMain.handle('books:setAuthor', async (_event, bookId: string, authorId: string) => {
  return setBookAuthor(bookId, authorId)
})

ipcMain.handle('books:getTopRated', async (_event, limit?: number) => {
  return getTopRatedBooks(limit)
})
