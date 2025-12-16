import { useState, useEffect, useCallback, useMemo } from 'react'
import type { Book, Author, Genre, SearchResult } from '../types'
import { mockBooks, mockAuthors, mockGenres } from '../data/mockData'

// Check if we're in Electron environment with API available
const hasAPI = typeof window !== 'undefined' && window.api !== undefined

interface UseSearchResult {
  query: string
  setQuery: (query: string) => void
  results: SearchResult[]
  bookResults: Book[]
  loading: boolean
  error: Error | null
  clear: () => void
}

export function useSearch(debounceMs = 300): UseSearchResult {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [bookResults, setBookResults] = useState<Book[]>([])
  const [authorResults, setAuthorResults] = useState<Author[]>([])
  const [genreResults, setGenreResults] = useState<Genre[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Debounce the query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [query, debounceMs])

  // Search when debounced query changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setBookResults([])
      setAuthorResults([])
      setGenreResults([])
      return
    }

    async function performSearch(): Promise<void> {
      setLoading(true)
      setError(null)
      try {
        if (hasAPI) {
          const [books, authors, genres] = await Promise.all([
            window.api.books.search(debouncedQuery),
            window.api.authors.search(debouncedQuery),
            window.api.genres.search(debouncedQuery)
          ])
          setBookResults(books)
          setAuthorResults(authors)
          setGenreResults(genres)
        } else {
          // Mock search
          await new Promise((resolve) => setTimeout(resolve, 200))
          const lowerQuery = debouncedQuery.toLowerCase()

          const filteredBooks = mockBooks.filter(
            (book) =>
              book.title.toLowerCase().includes(lowerQuery) ||
              book.description.toLowerCase().includes(lowerQuery)
          )

          const filteredAuthors = mockAuthors.filter((author) =>
            author.name.toLowerCase().includes(lowerQuery)
          )

          const filteredGenres = mockGenres.filter(
            (genre) =>
              genre.name.toLowerCase().includes(lowerQuery) ||
              genre.description.toLowerCase().includes(lowerQuery)
          )

          setBookResults(filteredBooks)
          setAuthorResults(filteredAuthors)
          setGenreResults(filteredGenres)
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Search failed'))
        // Fallback to mock search
        const lowerQuery = debouncedQuery.toLowerCase()
        setBookResults(
          mockBooks.filter(
            (book) =>
              book.title.toLowerCase().includes(lowerQuery) ||
              book.description.toLowerCase().includes(lowerQuery)
          )
        )
        setAuthorResults(
          mockAuthors.filter((author) => author.name.toLowerCase().includes(lowerQuery))
        )
        setGenreResults(
          mockGenres.filter(
            (genre) =>
              genre.name.toLowerCase().includes(lowerQuery) ||
              genre.description.toLowerCase().includes(lowerQuery)
          )
        )
      } finally {
        setLoading(false)
      }
    }

    performSearch()
  }, [debouncedQuery])

  // Combine results into SearchResult format
  const results = useMemo((): SearchResult[] => {
    const combined: SearchResult[] = []

    bookResults.forEach((book) => {
      combined.push({
        type: 'book',
        id: book.id,
        title: book.title,
        subtitle: `${book.publishedYear} • Rating: ${book.rating}`
      })
    })

    authorResults.forEach((author) => {
      combined.push({
        type: 'author',
        id: author.id,
        title: author.name,
        subtitle: `${author.nationality} • Born ${author.birthYear}`
      })
    })

    genreResults.forEach((genre) => {
      combined.push({
        type: 'genre',
        id: genre.id,
        title: genre.name,
        subtitle: genre.description
      })
    })

    return combined
  }, [bookResults, authorResults, genreResults])

  const clear = useCallback(() => {
    setQuery('')
    setDebouncedQuery('')
    setBookResults([])
    setAuthorResults([])
    setGenreResults([])
  }, [])

  return {
    query,
    setQuery,
    results,
    bookResults,
    loading,
    error,
    clear
  }
}
