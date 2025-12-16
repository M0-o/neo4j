import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, Palette, Bell, Database, Info, Check, AlertCircle } from 'lucide-react'

export function SettingsPage(): React.JSX.Element {
  const [seedStatus, setSeedStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSeedDatabase = async (): Promise<void> => {
    if (!window.api?.db?.seed) {
      setSeedStatus('error')
      return
    }

    setSeedStatus('loading')
    try {
      await window.api.db.seed()
      setSeedStatus('success')
      // Reset status after 3 seconds
      setTimeout(() => setSeedStatus('idle'), 3000)
    } catch {
      setSeedStatus('error')
      // Reset status after 3 seconds
      setTimeout(() => setSeedStatus('idle'), 3000)
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
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-surface-elevated)]">
            <Settings className="h-5 w-5 text-[var(--color-text-primary)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Settings</h1>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Customize your reading experience
            </p>
          </div>
        </div>
      </motion.header>

      {/* Settings Sections */}
      <div className="max-w-2xl space-y-6">
        {/* Appearance */}
        <motion.section
          className="rounded-xl bg-[var(--color-surface)] p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="mb-4 flex items-center gap-3">
            <Palette className="h-5 w-5 text-[var(--color-primary)]" />
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Appearance</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--color-text-primary)]">Theme</p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Choose your preferred theme
                </p>
              </div>
              <select className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-2 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-primary)] focus:outline-none">
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="system">System</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--color-text-primary)]">Accent Color</p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Primary color for UI elements
                </p>
              </div>
              <div className="flex gap-2">
                {['#6366f1', '#ec4899', '#14b8a6', '#f59e0b'].map((color) => (
                  <button
                    key={color}
                    className="h-8 w-8 rounded-full border-2 border-transparent transition-all hover:border-white"
                    style={{ backgroundColor: color }}
                    aria-label={`Select ${color} as accent color`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Notifications */}
        <motion.section
          className="rounded-xl bg-[var(--color-surface)] p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-4 flex items-center gap-3">
            <Bell className="h-5 w-5 text-[var(--color-accent)]" />
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
              Notifications
            </h2>
          </div>

          <div className="space-y-4">
            {['New recommendations', 'Friend activity', 'Reading reminders'].map((item) => (
              <div key={item} className="flex items-center justify-between">
                <p className="text-sm text-[var(--color-text-primary)]">{item}</p>
                <button className="h-6 w-10 rounded-full bg-[var(--color-primary)] p-0.5 transition-colors">
                  <span className="block h-5 w-5 translate-x-4 rounded-full bg-white transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Database */}
        <motion.section
          className="rounded-xl bg-[var(--color-surface)] p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mb-4 flex items-center gap-3">
            <Database className="h-5 w-5 text-[var(--color-node-genre)]" />
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Database</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--color-text-primary)]">
                  Neo4j Connection
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">localhost:7687</p>
              </div>
              <span className="flex items-center gap-2 text-xs text-[var(--color-rating-high)]">
                <span className="h-2 w-2 rounded-full bg-[var(--color-rating-high)]" />
                Connected
              </span>
            </div>

            <button
              className={`flex w-full items-center justify-center gap-2 rounded-lg border py-2 text-sm transition-colors ${
                seedStatus === 'success'
                  ? 'border-[var(--color-rating-high)] bg-[var(--color-rating-high)]/10 text-[var(--color-rating-high)]'
                  : seedStatus === 'error'
                    ? 'border-[var(--color-rating-low)] bg-[var(--color-rating-low)]/10 text-[var(--color-rating-low)]'
                    : 'border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)]'
              }`}
              onClick={handleSeedDatabase}
              disabled={seedStatus === 'loading'}
            >
              {seedStatus === 'loading' && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              )}
              {seedStatus === 'success' && <Check className="h-4 w-4" />}
              {seedStatus === 'error' && <AlertCircle className="h-4 w-4" />}
              {seedStatus === 'idle' && 'Seed Sample Data'}
              {seedStatus === 'loading' && 'Seeding...'}
              {seedStatus === 'success' && 'Database Seeded!'}
              {seedStatus === 'error' && 'Seed Failed'}
            </button>
          </div>
        </motion.section>

        {/* About */}
        <motion.section
          className="rounded-xl bg-[var(--color-surface)] p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="mb-4 flex items-center gap-3">
            <Info className="h-5 w-5 text-[var(--color-text-muted)]" />
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">About</h2>
          </div>

          <div className="text-sm text-[var(--color-text-secondary)]">
            <p className="mb-2">BookGraph v1.0.0</p>
            <p className="text-xs text-[var(--color-text-muted)]">
              A desktop book recommendation application built with Electron, React, and Neo4j.
            </p>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
