import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import type { Book } from '../../types'
import { BookCard } from './BookCard'

interface BookGridProps {
  books: Book[]
  loading?: boolean
  error?: Error | null
  onBookClick?: (book: Book) => void
  title?: string
  showReason?: boolean
  reasons?: Record<string, string>
  emptyMessage?: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
}

export function BookGrid({
  books,
  loading = false,
  error = null,
  onBookClick,
  title,
  showReason = false,
  reasons = {},
  emptyMessage = 'No books found'
}: BookGridProps): React.JSX.Element {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="h-10 w-10 animate-spin text-[var(--color-primary)]" />
        <p className="mt-4 text-sm text-[var(--color-text-secondary)]">Loading books...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="rounded-lg bg-[var(--color-rating-low)]/10 px-6 py-4 text-center">
          <p className="text-sm text-[var(--color-rating-low)]">
            Failed to load books. Please try again.
          </p>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">{error.message}</p>
        </div>
      </div>
    )
  }

  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-sm text-[var(--color-text-secondary)]">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div>
      {title && (
        <motion.h2
          className="mb-6 text-xl font-semibold text-[var(--color-text-primary)]"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {title}
        </motion.h2>
      )}

      <motion.div
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {books.map((book, index) => (
          <BookCard
            key={book.id}
            book={book}
            index={index}
            onClick={onBookClick}
            showReason={showReason}
            reason={reasons[book.id]}
          />
        ))}
      </motion.div>
    </div>
  )
}
