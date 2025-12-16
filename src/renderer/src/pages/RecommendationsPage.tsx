import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, RefreshCw } from 'lucide-react'
import { BookGrid, BookDetailModal } from '../components/Books'
import { useRecommendations } from '../hooks/useBooks'
import type { Book } from '../types'

type RecommendationType = 'all' | 'for-you' | 'trending' | 'by-genre'

export function RecommendationsPage(): React.JSX.Element {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [recType, setRecType] = useState<RecommendationType>('all')
  const { recommendations, loading, refetch } = useRecommendations(undefined, 12)

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

  // Filter by recommendation type (mock implementation)
  const filteredBooks = useMemo(() => {
    if (recType === 'all') return recommendedBooks
    // In a real implementation, you would filter based on the recommendation source
    return recommendedBooks.filter((_, index) => {
      if (recType === 'for-you') return index % 3 === 0
      if (recType === 'trending') return index % 3 === 1
      if (recType === 'by-genre') return index % 3 === 2
      return true
    })
  }, [recommendedBooks, recType])

  const handleBookClick = (book: Book): void => {
    setSelectedBook(book)
  }

  const handleCloseModal = (): void => {
    setSelectedBook(null)
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)]">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">For You</h1>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Personalized recommendations powered by graph algorithms
              </p>
            </div>
          </div>

          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 rounded-lg bg-[var(--color-surface)] px-4 py-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </motion.header>

      {/* Recommendation Type Tabs */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex gap-2">
          {[
            { id: 'all', label: 'All Recommendations' },
            { id: 'for-you', label: 'Based on History' },
            { id: 'trending', label: 'Trending Now' },
            { id: 'by-genre', label: 'By Your Genres' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRecType(tab.id as RecommendationType)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                recType === tab.id
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Recommendation Score Info */}
      <motion.div
        className="mb-6 rounded-lg bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-accent)]/10 p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <p className="text-sm text-[var(--color-text-secondary)]">
          <Sparkles className="mr-2 inline-block h-4 w-4 text-[var(--color-primary)]" />
          Recommendations are generated using Neo4j graph algorithms that analyze reading patterns,
          genre preferences, and community interactions.
        </p>
      </motion.div>

      {/* Recommended Books */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <BookGrid
          books={filteredBooks}
          loading={loading}
          onBookClick={handleBookClick}
          showReason
          reasons={recommendationReasons}
          emptyMessage="No recommendations available. Start reading to get personalized suggestions!"
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
