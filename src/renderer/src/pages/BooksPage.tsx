import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Filter, SortAsc, SortDesc, LayoutGrid, List as ListIcon } from 'lucide-react'
import { BookGrid, BookDetailModal } from '../components/Books'
import { useBooks } from '../hooks/useBooks'
import type { Book } from '../types'

type SortOption = 'title' | 'rating' | 'year' | 'pages'
type SortDirection = 'asc' | 'desc'
type ViewMode = 'grid' | 'list'

export function BooksPage(): React.JSX.Element {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>('rating')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const { books, loading, error } = useBooks()

  // Sort books
  const sortedBooks = [...books].sort((a, b) => {
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
      case 'pages':
        comparison = a.pages - b.pages
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)]">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">All Books</h1>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Browse the complete book collection
              </p>
            </div>
          </div>

          {/* Total count */}
          <div className="rounded-lg bg-[var(--color-surface)] px-4 py-2">
            <p className="text-sm text-[var(--color-text-muted)]">Total Books</p>
            <p className="text-2xl font-bold text-[var(--color-text-primary)]">{books.length}</p>
          </div>
        </div>
      </motion.header>

      {/* Filters and Controls */}
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
              <option value="year">Year Published</option>
              <option value="pages">Page Count</option>
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

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
              viewMode === 'grid'
                ? 'bg-[var(--color-primary)] text-white'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
              viewMode === 'list'
                ? 'bg-[var(--color-primary)] text-white'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
            aria-label="List view"
          >
            <ListIcon className="h-4 w-4" />
          </button>
        </div>
      </motion.div>

      {/* Books Grid */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <BookGrid
          books={sortedBooks}
          loading={loading}
          error={error}
          onBookClick={handleBookClick}
          emptyMessage="No books in the collection yet."
        />
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
