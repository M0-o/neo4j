import { motion } from 'framer-motion'
import { Network, ZoomIn, ZoomOut, Maximize2, RefreshCw, Info } from 'lucide-react'

interface GraphVisualizationProps {
  className?: string
}

/**
 * GraphVisualization - Placeholder component for Neo4j graph visualization
 *
 * This component serves as a wrapper/placeholder for integrating a graph visualization
 * library such as:
 * - react-force-graph (recommended): https://github.com/vasturiano/react-force-graph
 * - vis-network: https://visjs.github.io/vis-network/docs/network/
 * - D3.js force simulation
 * - Neovis.js: https://github.com/neo4j-contrib/neovis.js
 *
 * To implement actual graph visualization:
 * 1. Install react-force-graph: npm install react-force-graph
 * 2. Replace the placeholder content with ForceGraph2D or ForceGraph3D component
 * 3. Connect to Neo4j data via the window.api interface
 *
 * Example integration:
 * ```tsx
 * import ForceGraph2D from 'react-force-graph-2d'
 *
 * const graphData = {
 *   nodes: [
 *     { id: 'book-1', name: 'The Midnight Library', type: 'book' },
 *     { id: 'author-1', name: 'Matt Haig', type: 'author' },
 *   ],
 *   links: [
 *     { source: 'author-1', target: 'book-1', label: 'WROTE' },
 *   ],
 * }
 *
 * <ForceGraph2D
 *   graphData={graphData}
 *   nodeColor={node => getNodeColor(node.type)}
 *   linkColor={() => 'var(--color-edge)'}
 * />
 * ```
 */
export function GraphVisualization({ className = '' }: GraphVisualizationProps): React.JSX.Element {
  return (
    <div className={`flex h-full flex-col ${className}`}>
      {/* Graph Controls */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
        <div className="flex items-center gap-2">
          <Network className="h-5 w-5 text-[var(--color-primary)]" />
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
            Knowledge Graph
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]"
            aria-label="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]"
            aria-label="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]"
            aria-label="Fit to screen"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]"
            aria-label="Refresh graph"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Graph Canvas Area */}
      <div className="relative flex-1 bg-[var(--color-background)]">
        {/* Placeholder content - replace with actual graph visualization */}
        <motion.div
          className="flex h-full flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Animated placeholder nodes */}
          <div className="relative mb-8 h-64 w-64">
            {/* Central node */}
            <motion.div
              className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--color-node-book)] shadow-lg"
              animate={{
                scale: [1, 1.1, 1],
                boxShadow: [
                  '0 0 20px var(--color-node-book)',
                  '0 0 30px var(--color-node-book)',
                  '0 0 20px var(--color-node-book)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-xs font-semibold text-white">Book</span>
            </motion.div>

            {/* Orbiting nodes */}
            {[
              { color: 'var(--color-node-author)', label: 'Author', angle: 0 },
              { color: 'var(--color-node-genre)', label: 'Genre', angle: 120 },
              { color: 'var(--color-node-user)', label: 'User', angle: 240 }
            ].map((node, index) => (
              <motion.div
                key={node.label}
                className="absolute flex h-12 w-12 items-center justify-center rounded-full shadow-md"
                style={{ backgroundColor: node.color }}
                animate={{
                  x: [
                    Math.cos((node.angle * Math.PI) / 180) * 80,
                    Math.cos(((node.angle + 360) * Math.PI) / 180) * 80
                  ],
                  y: [
                    Math.sin((node.angle * Math.PI) / 180) * 80,
                    Math.sin(((node.angle + 360) * Math.PI) / 180) * 80
                  ]
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: index * 0.5
                }}
                initial={{
                  left: '50%',
                  top: '50%',
                  x: Math.cos((node.angle * Math.PI) / 180) * 80 - 24,
                  y: Math.sin((node.angle * Math.PI) / 180) * 80 - 24
                }}
              >
                <span className="text-[10px] font-medium text-white">{node.label}</span>
              </motion.div>
            ))}

            {/* Connection lines (SVG) */}
            <svg
              className="absolute inset-0 h-full w-full"
              style={{ transform: 'translate(-50%, -50%)', left: '50%', top: '50%' }}
            >
              {[0, 120, 240].map((angle) => (
                <motion.line
                  key={angle}
                  x1="128"
                  y1="128"
                  x2={128 + Math.cos((angle * Math.PI) / 180) * 80}
                  y2={128 + Math.sin((angle * Math.PI) / 180) * 80}
                  stroke="var(--color-edge)"
                  strokeWidth="2"
                  strokeDasharray="4"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              ))}
            </svg>
          </div>

          <div className="text-center">
            <h4 className="mb-2 text-lg font-semibold text-[var(--color-text-primary)]">
              Graph Visualization
            </h4>
            <p className="mb-4 max-w-md text-sm text-[var(--color-text-secondary)]">
              Explore relationships between books, authors, genres, and readers in an interactive
              graph view powered by your Neo4j database.
            </p>

            {/* Info box */}
            <div className="mx-auto flex max-w-md items-start gap-3 rounded-lg bg-[var(--color-surface)] p-4 text-left">
              <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--color-primary)]" />
              <div className="text-xs text-[var(--color-text-muted)]">
                <p className="mb-1 font-medium text-[var(--color-text-secondary)]">
                  Integration Note
                </p>
                <p>
                  Install{' '}
                  <code className="rounded bg-[var(--color-surface-elevated)] px-1">
                    react-force-graph
                  </code>{' '}
                  to enable interactive graph visualization of your Neo4j data.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 rounded-lg bg-[var(--color-surface)] p-3 shadow-lg">
          <p className="mb-2 text-xs font-medium text-[var(--color-text-secondary)]">Node Types</p>
          <div className="space-y-2">
            {[
              { color: 'var(--color-node-book)', label: 'Books' },
              { color: 'var(--color-node-author)', label: 'Authors' },
              { color: 'var(--color-node-genre)', label: 'Genres' },
              { color: 'var(--color-node-user)', label: 'Users' }
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-[var(--color-text-muted)]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
