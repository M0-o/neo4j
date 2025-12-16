import { motion } from 'framer-motion'
import { Star, BookOpen, Calendar } from 'lucide-react'
import type { Book } from '../../types'

interface BookCardProps {
  book: Book
  onClick?: (book: Book) => void
  index?: number
  showReason?: boolean
  reason?: string
}

// Placeholder cover image when none is provided
const placeholderCover =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDIwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiMyNTI1MjUiLz48cGF0aCBkPSJNODAgMTIwSDEyMFYxODBIODBWMTIwWiIgZmlsbD0iIzQwNDA0MCIvPjxwYXRoIGQ9Ik04NSAxMzVIMTE1VjE0MEg4NVYxMzVaTTg1IDE1MEgxMTVWMTU1SDg1VjE1MFpNODUgMTY1SDEwNVYxNzBIODVWMTY1WiIgZmlsbD0iIzUyNTI1MiIvPjwvc3ZnPg=='

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.05,
      duration: 0.3,
      ease: 'easeOut' as const
    }
  }),
  hover: {
    y: -8,
    transition: {
      duration: 0.2,
      ease: 'easeOut' as const
    }
  }
}

const imageVariants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: 'easeOut' as const
    }
  }
}

function getRatingColor(rating: number): string {
  if (rating >= 4.5) return 'var(--color-rating-high)'
  if (rating >= 3.5) return 'var(--color-rating-medium)'
  return 'var(--color-rating-low)'
}

export function BookCard({
  book,
  onClick,
  index = 0,
  showReason = false,
  reason
}: BookCardProps): React.JSX.Element {
  const coverImage = book.coverImage || placeholderCover

  return (
    <motion.article
      className="group cursor-pointer overflow-hidden rounded-xl bg-[var(--color-surface)] shadow-lg transition-shadow hover:shadow-xl"
      variants={cardVariants}
      custom={index}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onClick={() => onClick?.(book)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.(book)
        }
      }}
      aria-label={`View details for ${book.title}`}
    >
      {/* Cover Image */}
      <div className="relative aspect-[2/3] overflow-hidden bg-[var(--color-surface-elevated)]">
        <motion.img
          src={coverImage}
          alt={`Cover of ${book.title}`}
          className="h-full w-full object-cover"
          variants={imageVariants}
          loading="lazy"
          onError={(e) => {
            const target = e.currentTarget
            target.src = placeholderCover
          }}
        />

        {/* Rating Badge */}
        <div
          className="absolute right-2 top-2 flex items-center gap-1 rounded-full px-2 py-1"
          style={{ backgroundColor: getRatingColor(book.rating) }}
        >
          <Star className="h-3 w-3 fill-white text-white" />
          <span className="text-xs font-semibold text-white">{book.rating.toFixed(1)}</span>
        </div>

        {/* Hover Overlay */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        >
          <span className="flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white">
            <BookOpen className="h-4 w-4" />
            View Details
          </span>
        </motion.div>
      </div>

      {/* Book Info */}
      <div className="p-4">
        <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-[var(--color-text-primary)]">
          {book.title}
        </h3>

        <div className="mb-2 flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
          <Calendar className="h-3 w-3" />
          <span>{book.publishedYear}</span>
          <span className="text-[var(--color-border)]">•</span>
          <span>{book.pages} pages</span>
        </div>

        <p className="line-clamp-2 text-xs text-[var(--color-text-secondary)]">
          {book.description}
        </p>

        {/* Recommendation reason */}
        {showReason && reason && (
          <div className="mt-3 rounded-lg bg-[var(--color-surface-elevated)] px-3 py-2">
            <p className="text-xs text-[var(--color-primary-light)]">{reason}</p>
          </div>
        )}
      </div>
    </motion.article>
  )
}
