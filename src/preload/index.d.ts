import { ElectronAPI } from '@electron-toolkit/preload'

// Type definitions for the API
export interface Book {
  id: string
  title: string
  publishedYear: number
  pages: number
  isbn: string
  rating: number
  description: string
}

export interface BookWithDetails extends Book {
  authors: { id: string; name: string }[]
  genres: { id: string; name: string }[]
}

export interface Author {
  id: string
  name: string
  birthYear: number
  nationality: string
}

export interface AuthorWithBooks extends Author {
  books: { id: string; title: string; publishedYear: number }[]
}

export interface Genre {
  id: string
  name: string
  description: string
}

export interface GenreWithStats extends Genre {
  bookCount: number
}

export interface User {
  id: string
  username: string
  email: string
  createdAt: string
  preferredGenres: string[]
}

export interface UserWithActivity extends User {
  booksRead: number
  followers: number
  following: number
}

export interface ReadingHistory {
  book: Book
  rating: number
  readDate: string
  review: string
}

export interface RecommendationResult {
  book: Book
  score: number
  reason: string
}

export interface API {
  db: {
    seed: () => Promise<{ success: boolean }>
  }
  books: {
    getAll: () => Promise<Book[]>
    getById: (id: string) => Promise<BookWithDetails | null>
    search: (query: string) => Promise<Book[]>
    getByGenre: (genreId: string) => Promise<Book[]>
    getByAuthor: (authorId: string) => Promise<Book[]>
    getSimilar: (bookId: string, limit?: number) => Promise<Book[]>
    getTopRated: (limit?: number) => Promise<Book[]>
    create: (book: Omit<Book, 'id'>) => Promise<Book>
    update: (id: string, updates: Partial<Omit<Book, 'id'>>) => Promise<Book | null>
    delete: (id: string) => Promise<boolean>
  }
  authors: {
    getAll: () => Promise<Author[]>
    getById: (id: string) => Promise<AuthorWithBooks | null>
    search: (query: string) => Promise<Author[]>
    getByNationality: (nationality: string) => Promise<Author[]>
    getTop: (limit?: number) => Promise<(Author & { bookCount: number })[]>
    create: (author: Omit<Author, 'id'>) => Promise<Author>
    update: (id: string, updates: Partial<Omit<Author, 'id'>>) => Promise<Author | null>
    delete: (id: string) => Promise<boolean>
  }
  genres: {
    getAll: () => Promise<Genre[]>
    getById: (id: string) => Promise<Genre | null>
    getWithStats: () => Promise<GenreWithStats[]>
    search: (query: string) => Promise<Genre[]>
    getPopular: (limit?: number) => Promise<GenreWithStats[]>
    create: (genre: Omit<Genre, 'id'>) => Promise<Genre>
    update: (id: string, updates: Partial<Omit<Genre, 'id'>>) => Promise<Genre | null>
    delete: (id: string) => Promise<boolean>
  }
  users: {
    getAll: () => Promise<User[]>
    getById: (id: string) => Promise<UserWithActivity | null>
    getByUsername: (username: string) => Promise<User | null>
    create: (user: Omit<User, 'id' | 'createdAt'>) => Promise<User>
    update: (id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>) => Promise<User | null>
    delete: (id: string) => Promise<boolean>
    getReadingHistory: (userId: string) => Promise<ReadingHistory[]>
    markBookAsRead: (
      userId: string,
      bookId: string,
      rating: number,
      review?: string
    ) => Promise<boolean>
    removeBookFromRead: (userId: string, bookId: string) => Promise<boolean>
    getWishlist: (userId: string) => Promise<Book[]>
    addToWishlist: (userId: string, bookId: string) => Promise<boolean>
    removeFromWishlist: (userId: string, bookId: string) => Promise<boolean>
    follow: (followerId: string, followedId: string) => Promise<boolean>
    unfollow: (followerId: string, followedId: string) => Promise<boolean>
    getFollowers: (userId: string) => Promise<User[]>
    getFollowing: (userId: string) => Promise<User[]>
    updatePreferredGenres: (userId: string, genres: string[]) => Promise<User | null>
  }
  recommendations: {
    forUser: (userId: string, limit?: number) => Promise<RecommendationResult[]>
    fromBook: (bookId: string, limit?: number) => Promise<RecommendationResult[]>
    byGenres: (userId: string, limit?: number) => Promise<RecommendationResult[]>
    fromFollowing: (userId: string, limit?: number) => Promise<RecommendationResult[]>
    byAuthors: (userId: string, limit?: number) => Promise<RecommendationResult[]>
    trending: (limit?: number) => Promise<RecommendationResult[]>
    hybrid: (userId: string, limit?: number) => Promise<RecommendationResult[]>
  }
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: API
  }
}
