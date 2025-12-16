import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Loader2, BookOpen, User, Tag } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { SearchResult } from '../../types'
import { useSearch } from '../../hooks/useSearch'

interface SearchBarProps {
  onBookSelect?: (bookId: string) => void
  placeholder?: string
  className?: string
}

const dropdownVariants = {
  hidden: {
    opacity: 0,
    y: -10,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: 'easeOut' as const
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.15
    }
  }
}

const resultVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: index * 0.03,
      duration: 0.2
    }
  })
}

function getTypeIcon(type: SearchResult['type']): React.JSX.Element {
  switch (type) {
    case 'book':
      return <BookOpen className="h-4 w-4" />
    case 'author':
      return <User className="h-4 w-4" />
    case 'genre':
      return <Tag className="h-4 w-4" />
    default:
      return <BookOpen className="h-4 w-4" />
  }
}

function getTypeColor(type: SearchResult['type']): string {
  switch (type) {
    case 'book':
      return 'var(--color-node-book)'
    case 'author':
      return 'var(--color-node-author)'
    case 'genre':
      return 'var(--color-node-genre)'
    default:
      return 'var(--color-primary)'
  }
}

export function SearchBar({
  onBookSelect,
  placeholder = 'Search books, authors, genres...',
  className = ''
}: SearchBarProps): React.JSX.Element {
  const { query, setQuery, results, loading, clear } = useSearch()
  const [isFocused, setIsFocused] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const showDropdown = isFocused && query.trim().length > 0

  // Custom setter that resets selected index when query changes
  const handleQueryChange = (newQuery: string): void => {
    setQuery(newQuery)
    setSelectedIndex(-1) // Reset selection when user types
  }

  const handleResultClick = (result: SearchResult): void => {
    if (result.type === 'book') {
      onBookSelect?.(result.id)
    } else if (result.type === 'author') {
      navigate(`/authors/${result.id}`)
    } else if (result.type === 'genre') {
      navigate(`/genres/${result.id}`)
    }
    clear()
    inputRef.current?.blur()
  }

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (!showDropdown) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleResultClick(results[selectedIndex])
        }
        break
      case 'Escape':
        e.preventDefault()
        clear()
        inputRef.current?.blur()
        break
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div
        className={`relative flex items-center rounded-xl border bg-[var(--color-surface)] transition-all ${
          isFocused
            ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20'
            : 'border-[var(--color-border)]'
        }`}
      >
        <Search className="absolute left-4 h-5 w-5 text-[var(--color-text-muted)]" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-transparent py-3 pl-12 pr-10 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none"
          aria-label="Search"
          aria-haspopup="listbox"
          aria-expanded={showDropdown}
        />
        {/* Loading / Clear button */}
        <div className="absolute right-4 flex items-center">
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin text-[var(--color-text-muted)]" />
          ) : query.length > 0 ? (
            <button
              onClick={clear}
              className="text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)]"
              aria-label="Clear search"
            >
              <X className="h-5 w-5" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Dropdown Results */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            className="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="listbox"
          >
            {results.length === 0 && !loading ? (
              <div className="px-4 py-6 text-center text-sm text-[var(--color-text-muted)]">
                No results found for &quot;{query}&quot;
              </div>
            ) : (
              <ul className="py-2">
                {results.map((result, index) => (
                  <motion.li
                    key={`${result.type}-${result.id}`}
                    custom={index}
                    variants={resultVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <button
                      onClick={() => handleResultClick(result)}
                      className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                        selectedIndex === index
                          ? 'bg-[var(--color-surface-hover)]'
                          : 'hover:bg-[var(--color-surface-hover)]'
                      }`}
                      role="option"
                      aria-selected={selectedIndex === index}
                    >
                      {/* Type Icon */}
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${getTypeColor(result.type)}20` }}
                      >
                        <span style={{ color: getTypeColor(result.type) }}>
                          {getTypeIcon(result.type)}
                        </span>
                      </div>

                      {/* Result Info */}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-[var(--color-text-primary)]">
                          {result.title}
                        </p>
                        {result.subtitle && (
                          <p className="truncate text-xs text-[var(--color-text-muted)]">
                            {result.subtitle}
                          </p>
                        )}
                      </div>

                      {/* Type Badge */}
                      <span
                        className="rounded-full px-2 py-0.5 text-xs font-medium capitalize"
                        style={{
                          backgroundColor: `${getTypeColor(result.type)}20`,
                          color: getTypeColor(result.type)
                        }}
                      >
                        {result.type}
                      </span>
                    </button>
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
