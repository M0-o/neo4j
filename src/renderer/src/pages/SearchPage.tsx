import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react'
import { BookGrid, BookDetailModal } from '../components/Books'
import { useSearch } from '../hooks/useSearch'
import type { Book } from '../types'

type SortOption = 'title' | 'rating' | 'year'
type SortDirection = 'asc' | 'desc'

export function SearchPage(): React.JSX.Element {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>('rating')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const { query, setQuery, bookResults, loading } = useSearch()

  // Sort results
  const sortedResults = [...bookResults].sort((a, b) => {
    let comparison = 0
    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title)
        break
      case 'rating':
        comparison = a.rating - b.rating
        break
      case 'year':
        comparison = a.publishedYear - b.publishedYear
        break
    }
    return sortDirection === 'desc' ? -comparison : comparison
  })

  const handleBookClick = (book: Book): void => {
    setSelectedBook(book)
  }

  const handleCloseModal = (): void => {
    setSelectedBook(null)
  }

  const toggleSortDirection = (): void => {
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
  }

  return (
    <div className="min-h-full px-8 py-6">
      {/* Header */}
      <motion.header
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)]">
            <Search className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Search Books</h1>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Find your next read by title, author, or description
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="max-w-3xl">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search books..."
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4 text-base text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] transition-all focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
          />
        </div>
      </motion.header>

      {/* Filters and Sort */}
      <motion.div
        className="mb-6 flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]">
            <Filter className="h-4 w-4" />
            Filters
          </button>

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--color-text-muted)]">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-primary)] focus:outline-none"
            >
              <option value="rating">Rating</option>
              <option value="title">Title</option>
              <option value="year">Year</option>
            </select>
            <button
              onClick={toggleSortDirection}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]"
              aria-label={sortDirection === 'asc' ? 'Sort descending' : 'Sort ascending'}
            >
              {sortDirection === 'asc' ? (
                <SortAsc className="h-4 w-4" />
              ) : (
                <SortDesc className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Results count */}
        {query.trim() && !loading && (
          <p className="text-sm text-[var(--color-text-muted)]">
            Found {sortedResults.length} result{sortedResults.length !== 1 ? 's' : ''}
          </p>
        )}
      </motion.div>

      {/* Results */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {!query.trim() ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-surface)]">
              <Search className="h-8 w-8 text-[var(--color-text-muted)]" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-[var(--color-text-primary)]">
              Start searching
            </h3>
            <p className="max-w-md text-sm text-[var(--color-text-secondary)]">
              Enter a book title, author name, or keywords to find books in the database.
            </p>
          </div>
        ) : (
          <BookGrid
            books={sortedResults}
            loading={loading}
            onBookClick={handleBookClick}
            emptyMessage={`No books found for "${query}"`}
          />
        )}
      </motion.section>

      {/* Book Detail Modal */}
      <BookDetailModal
        book={selectedBook}
        isOpen={selectedBook !== null}
        onClose={handleCloseModal}
        onBookClick={handleBookClick}
      />
    </div>
  )
}
