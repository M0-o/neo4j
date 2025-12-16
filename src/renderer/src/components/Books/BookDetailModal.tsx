import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, BookOpen, Calendar, Hash, ExternalLink } from 'lucide-react'
import type { Book } from '../../types'
import { useSimilarBooks } from '../../hooks/useBooks'
import { BookCard } from './BookCard'

interface BookDetailModalProps {
  book: Book | null
  isOpen: boolean
  onClose: () => void
  onBookClick?: (book: Book) => void
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 30
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: 0.2
    }
  }
}

// Placeholder cover image when none is provided
const placeholderCover =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDIwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiMyNTI1MjUiLz48cGF0aCBkPSJNODAgMTIwSDEyMFYxODBIODBWMTIwWiIgZmlsbD0iIzQwNDA0MCIvPjxwYXRoIGQ9Ik04NSAxMzVIMTE1VjE0MEg4NVYxMzVaTTg1IDE1MEgxMTVWMTU1SDg1VjE1MFpNODUgMTY1SDEwNVYxNzBIODVWMTY1WiIgZmlsbD0iIzUyNTI1MiIvPjwvc3ZnPg=='

function getRatingColor(rating: number): string {
  if (rating >= 4.5) return 'var(--color-rating-high)'
  if (rating >= 3.5) return 'var(--color-rating-medium)'
  return 'var(--color-rating-low)'
}

export function BookDetailModal({
  book,
  isOpen,
  onClose,
  onBookClick
}: BookDetailModalProps): React.JSX.Element {
  const { books: similarBooks, loading: loadingSimilar } = useSimilarBooks(book?.id || null, 4)

  // Close on escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  const handleSimilarBookClick = (similarBook: Book): void => {
    onBookClick?.(similarBook)
  }

  if (!book) return <></>

  const coverImage = book.coverImage || placeholderCover

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-[var(--color-surface)] shadow-2xl"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-labelledby="book-title"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Content */}
            <div className="flex flex-col md:flex-row">
              {/* Cover Image */}
              <div className="flex-shrink-0 p-6 md:w-72">
                <motion.img
                  src={coverImage}
                  alt={`Cover of ${book.title}`}
                  className="w-full rounded-xl shadow-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = placeholderCover
                  }}
                />
              </div>

              {/* Details */}
              <div className="flex-1 p-6 pt-0 md:pt-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <h2
                    id="book-title"
                    className="mb-2 text-2xl font-bold text-[var(--color-text-primary)]"
                  >
                    {book.title}
                  </h2>

                  {/* Rating */}
                  <div className="mb-4 flex items-center gap-2">
                    <div
                      className="flex items-center gap-1 rounded-full px-3 py-1"
                      style={{ backgroundColor: getRatingColor(book.rating) }}
                    >
                      <Star className="h-4 w-4 fill-white text-white" />
                      <span className="text-sm font-semibold text-white">
                        {book.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {/* Meta info */}
                  <div className="mb-6 flex flex-wrap gap-4 text-sm text-[var(--color-text-secondary)]">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Published {book.publishedYear}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span>{book.pages} pages</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      <span>ISBN: {book.isbn}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <h3 className="mb-2 text-sm font-semibold text-[var(--color-text-primary)]">
                      Description
                    </h3>
                    <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                      {book.description}
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="mb-6 flex flex-wrap gap-3">
                    <button className="flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-dark)]">
                      <BookOpen className="h-4 w-4" />
                      Add to Reading List
                    </button>
                    <button className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-transparent px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-surface-hover)]">
                      <ExternalLink className="h-4 w-4" />
                      View in Graph
                    </button>
                  </div>
                </motion.div>

                {/* Similar Books Section */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <h3 className="mb-4 text-sm font-semibold text-[var(--color-text-primary)]">
                    Users who read this also read...
                  </h3>
                  {loadingSimilar ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-primary)] border-t-transparent" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {similarBooks.map((similarBook, index) => (
                        <BookCard
                          key={similarBook.id}
                          book={similarBook}
                          index={index}
                          onClick={handleSimilarBookClick}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
