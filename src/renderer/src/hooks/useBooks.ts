import { useState, useEffect, useCallback } from 'react'
import type { Book, RecommendationResult } from '../types'
import { mockBooks, mockRecommendations, mockSimilarBooks } from '../data/mockData'

// Check if we're in Electron environment with API available
const hasAPI = typeof window !== 'undefined' && window.api !== undefined

interface UseBooksResult {
  books: Book[]
  loading: boolean
  error: Error | null
  refetch: () => void
}

export function useBooks(): UseBooksResult {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchBooks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      if (hasAPI) {
        const data = await window.api.books.getAll()
        setBooks(data)
      } else {
        // Use mock data when API is not available
        await new Promise((resolve) => setTimeout(resolve, 500))
        setBooks(mockBooks)
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch books'))
      // Fallback to mock data on error
      setBooks(mockBooks)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  return { books, loading, error, refetch: fetchBooks }
}

interface UseTopRatedBooksResult {
  books: Book[]
  loading: boolean
  error: Error | null
}

export function useTopRatedBooks(limit = 10): UseTopRatedBooksResult {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchTopRated(): Promise<void> {
      setLoading(true)
      setError(null)
      try {
        if (hasAPI) {
          const data = await window.api.books.getTopRated(limit)
          setBooks(data)
        } else {
          await new Promise((resolve) => setTimeout(resolve, 300))
          const sorted = [...mockBooks].sort((a, b) => b.rating - a.rating).slice(0, limit)
          setBooks(sorted)
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch top rated books'))
        const sorted = [...mockBooks].sort((a, b) => b.rating - a.rating).slice(0, limit)
        setBooks(sorted)
      } finally {
        setLoading(false)
      }
    }

    fetchTopRated()
  }, [limit])

  return { books, loading, error }
}

interface UseBookDetailsResult {
  book: Book | null
  loading: boolean
  error: Error | null
}

export function useBookDetails(bookId: string | null): UseBookDetailsResult {
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!bookId) {
      setBook(null)
      return
    }

    const currentBookId = bookId // Capture non-null value for async function

    async function fetchBook(): Promise<void> {
      setLoading(true)
      setError(null)
      try {
        if (hasAPI) {
          const data = await window.api.books.getById(currentBookId)
          setBook(data)
        } else {
          await new Promise((resolve) => setTimeout(resolve, 200))
          const found = mockBooks.find((b) => b.id === currentBookId) || null
          setBook(found)
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch book details'))
        const found = mockBooks.find((b) => b.id === currentBookId) || null
        setBook(found)
      } finally {
        setLoading(false)
      }
    }

    fetchBook()
  }, [bookId])

  return { book, loading, error }
}

interface UseSimilarBooksResult {
  books: Book[]
  loading: boolean
  error: Error | null
}

export function useSimilarBooks(bookId: string | null, limit = 5): UseSimilarBooksResult {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!bookId) {
      setBooks([])
      return
    }

    const currentBookId = bookId // Capture non-null value for async function

    async function fetchSimilar(): Promise<void> {
      setLoading(true)
      setError(null)
      try {
        if (hasAPI) {
          const data = await window.api.books.getSimilar(currentBookId, limit)
          setBooks(data)
        } else {
          await new Promise((resolve) => setTimeout(resolve, 300))
          const similar = mockSimilarBooks[currentBookId] || mockBooks.slice(0, limit)
          setBooks(similar.slice(0, limit))
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch similar books'))
        const similar = mockSimilarBooks[currentBookId] || mockBooks.slice(0, limit)
        setBooks(similar.slice(0, limit))
      } finally {
        setLoading(false)
      }
    }

    fetchSimilar()
  }, [bookId, limit])

  return { books, loading, error }
}

interface UseRecommendationsResult {
  recommendations: RecommendationResult[]
  loading: boolean
  error: Error | null
  refetch: () => void
}

export function useRecommendations(userId?: string, limit = 10): UseRecommendationsResult {
  const [recommendations, setRecommendations] = useState<RecommendationResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchRecommendations = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      if (hasAPI && userId) {
        const data = await window.api.recommendations.forUser(userId, limit)
        setRecommendations(data)
      } else if (hasAPI) {
        const data = await window.api.recommendations.trending(limit)
        setRecommendations(data)
      } else {
        await new Promise((resolve) => setTimeout(resolve, 400))
        setRecommendations(mockRecommendations.slice(0, limit))
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch recommendations'))
      setRecommendations(mockRecommendations.slice(0, limit))
    } finally {
      setLoading(false)
    }
  }, [userId, limit])

  useEffect(() => {
    fetchRecommendations()
  }, [fetchRecommendations])

  return { recommendations, loading, error, refetch: fetchRecommendations }
}
