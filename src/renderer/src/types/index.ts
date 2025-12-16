// Re-export types from preload for convenience
// These match the types defined in src/preload/index.d.ts

export interface Book {
  id: string
  title: string
  publishedYear: number
  pages: number
  isbn: string
  rating: number
  description: string
  coverImage?: string // Optional cover image URL
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

// UI-specific types
export interface NavItem {
  id: string
  label: string
  icon: string
  path: string
}

export interface SearchResult {
  type: 'book' | 'author' | 'genre'
  id: string
  title: string
  subtitle?: string
}
