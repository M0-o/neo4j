import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Sparkles, BookOpen, Star } from 'lucide-react'
import { SearchBar } from '../components/Search'
import { BookGrid, BookDetailModal } from '../components/Books'
import { useRecommendations, useTopRatedBooks } from '../hooks/useBooks'
import type { Book } from '../types'

export function Dashboard(): React.JSX.Element {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const { recommendations, loading: loadingRecs } = useRecommendations(undefined, 6)
  const { books: topRated, loading: loadingTopRated } = useTopRatedBooks(8)

  // Extract books and reasons from recommendations
  const recommendedBooks = useMemo(() => recommendations.map((r) => r.book), [recommendations])
  const recommendationReasons = useMemo(
    () =>
      recommendations.reduce(
        (acc, r) => {
          acc[r.book.id] = r.reason
          return acc
        },
        {} as Record<string, string>
      ),
    [recommendations]
  )

  const handleBookClick = (book: Book): void => {
    setSelectedBook(book)
  }

  const handleCloseModal = (): void => {
    setSelectedBook(null)
  }

  const handleBookSelectFromSearch = (bookId: string): void => {
    // Find the book from either recommendations or topRated
    const book =
      recommendedBooks.find((b) => b.id === bookId) || topRated.find((b) => b.id === bookId)
    if (book) {
      setSelectedBook(book)
    }
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
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
              Welcome back, John! 👋
            </h1>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              Discover your next favorite book
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-4">
            <div className="flex items-center gap-2 rounded-lg bg-[var(--color-surface)] px-4 py-2">
              <BookOpen className="h-5 w-5 text-[var(--color-primary)]" />
              <div>
                <p className="text-xs text-[var(--color-text-muted)]">Books Read</p>
                <p className="text-lg font-semibold text-[var(--color-text-primary)]">12</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-[var(--color-surface)] px-4 py-2">
              <Star className="h-5 w-5 text-[var(--color-accent)]" />
              <div>
                <p className="text-xs text-[var(--color-text-muted)]">Avg Rating</p>
                <p className="text-lg font-semibold text-[var(--color-text-primary)]">4.5</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <SearchBar
          onBookSelect={handleBookSelectFromSearch}
          placeholder="Search for books, authors, or genres..."
          className="max-w-2xl"
        />
      </motion.header>

      {/* Recommended for You Section */}
      <motion.section
        className="mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary)]/20">
            <Sparkles className="h-5 w-5 text-[var(--color-primary)]" />
          </div>
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Recommended for You
          </h2>
        </div>
        <BookGrid
          books={recommendedBooks}
          loading={loadingRecs}
          onBookClick={handleBookClick}
          showReason
          reasons={recommendationReasons}
          emptyMessage="No recommendations yet. Start reading to get personalized suggestions!"
        />
      </motion.section>

      {/* Top Rated Books Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent)]/20">
            <TrendingUp className="h-5 w-5 text-[var(--color-accent)]" />
          </div>
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Top Rated Books
          </h2>
        </div>
        <BookGrid
          books={topRated}
          loading={loadingTopRated}
          onBookClick={handleBookClick}
          emptyMessage="No top rated books available."
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
