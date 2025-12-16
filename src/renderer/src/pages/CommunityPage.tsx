import { motion } from 'framer-motion'
import { Users, BookOpen, MessageCircle, TrendingUp } from 'lucide-react'

export function CommunityPage(): React.JSX.Element {
  return (
    <div className="min-h-full px-8 py-6">
      {/* Header */}
      <motion.header
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent)]">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Community</h1>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Connect with other readers and discover what they&apos;re reading
            </p>
          </div>
        </div>
      </motion.header>

      {/* Coming Soon Placeholder */}
      <motion.div
        className="flex flex-col items-center justify-center py-20"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="mb-8 grid grid-cols-2 gap-4">
          {[
            { icon: BookOpen, label: 'Reading Activity', color: 'var(--color-primary)' },
            { icon: MessageCircle, label: 'Book Reviews', color: 'var(--color-accent)' },
            { icon: Users, label: 'Reader Groups', color: 'var(--color-node-author)' },
            { icon: TrendingUp, label: 'Trending Books', color: 'var(--color-node-genre)' }
          ].map((feature, index) => (
            <motion.div
              key={feature.label}
              className="flex h-32 w-32 flex-col items-center justify-center rounded-2xl bg-[var(--color-surface)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <feature.icon className="mb-2 h-8 w-8" style={{ color: feature.color }} />
              <span className="text-xs text-[var(--color-text-muted)]">{feature.label}</span>
            </motion.div>
          ))}
        </div>

        <h2 className="mb-2 text-xl font-semibold text-[var(--color-text-primary)]">Coming Soon</h2>
        <p className="max-w-md text-center text-sm text-[var(--color-text-secondary)]">
          The community features are being developed. Soon you&apos;ll be able to follow other
          readers, join book clubs, and share your reading journey.
        </p>
      </motion.div>
    </div>
  )
}
