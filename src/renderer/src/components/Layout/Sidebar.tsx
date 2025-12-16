import { motion } from 'framer-motion'
import { NavLink, useLocation } from 'react-router-dom'
import {
  Home,
  Search,
  BookOpen,
  Users,
  TrendingUp,
  Settings,
  Network,
  type LucideIcon
} from 'lucide-react'

interface NavItem {
  id: string
  label: string
  icon: LucideIcon
  path: string
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/' },
  { id: 'search', label: 'Search', icon: Search, path: '/search' },
  { id: 'books', label: 'All Books', icon: BookOpen, path: '/books' },
  { id: 'recommendations', label: 'For You', icon: TrendingUp, path: '/recommendations' },
  { id: 'graph', label: 'Graph View', icon: Network, path: '/graph' },
  { id: 'community', label: 'Community', icon: Users, path: '/community' }
]

const sidebarVariants = {
  hidden: { x: -240, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut' as const,
      staggerChildren: 0.05
    }
  }
}

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.2 }
  }
}

export function Sidebar(): React.JSX.Element {
  const location = useLocation()

  return (
    <motion.aside
      className="fixed left-0 top-0 z-40 flex h-full w-60 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)]"
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Logo/Brand */}
      <div className="drag-region flex h-16 items-center border-b border-[var(--color-border)] px-6">
        <motion.div
          className="flex items-center gap-3"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-primary)]">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-[var(--color-text-primary)]">BookGraph</span>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="no-drag flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <motion.li key={item.id} variants={itemVariants}>
                <NavLink
                  to={item.path}
                  className={({ isActive: linkActive }) =>
                    `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      linkActive
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]'
                    }`
                  }
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute inset-0 rounded-lg bg-[var(--color-primary)]"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                  <Icon className="relative z-10 h-5 w-5" />
                  <span className="relative z-10">{item.label}</span>
                </NavLink>
              </motion.li>
            )
          })}
        </ul>
      </nav>

      {/* Settings */}
      <div className="no-drag border-t border-[var(--color-border)] p-3">
        <motion.div variants={itemVariants}>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]'
              }`
            }
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </NavLink>
        </motion.div>
      </div>

      {/* User section */}
      <div className="no-drag border-t border-[var(--color-border)] p-3">
        <motion.div
          className="flex items-center gap-3 rounded-lg bg-[var(--color-surface-elevated)] px-3 py-2.5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-accent)]">
            <span className="text-sm font-medium text-white">JD</span>
          </div>
          <div className="flex-1 truncate">
            <p className="text-sm font-medium text-[var(--color-text-primary)]">John Doe</p>
            <p className="text-xs text-[var(--color-text-muted)]">12 books read</p>
          </div>
        </motion.div>
      </div>
    </motion.aside>
  )
}
