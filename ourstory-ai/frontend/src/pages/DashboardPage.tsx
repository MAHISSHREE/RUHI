import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, BookHeart, Sparkles, TrendingUp, Calendar, ArrowRight } from 'lucide-react'
import { memoryApi } from '../services/api'
import type { MemoryStats, RelationshipMemory } from '../types'
import { MEMORY_TYPE_CONFIG } from '../types'
import { format } from 'date-fns'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

export default function DashboardPage() {
  const [stats, setStats] = useState<MemoryStats | null>(null)
  const [recentMemories, setRecentMemories] = useState<RelationshipMemory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([memoryApi.getStats(), memoryApi.getAll()])
      .then(([statsData, memories]) => {
        setStats(statsData)
        setRecentMemories(memories.slice(0, 3))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-pulse-soft" />
          <span className="text-sm text-rose-500 font-medium">OurStory Dashboard</span>
        </div>
        <h1 className="page-title mb-1">Your Love Story,</h1>
        <h1 className="font-serif text-3xl font-bold text-gradient">Remembered Forever</h1>
        <p className="text-warmGray-400 mt-2 text-sm">
          Every memory, every moment — safely stored and intelligently understood.
        </p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
      >
        <motion.div variants={item}>
          <Link to="/chat">
            <div className="card p-5 hover:shadow-md transition-all duration-200 group cursor-pointer border-rose-100 hover:border-rose-200">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-rose-200 group-hover:scale-105 transition-transform">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-4 h-4 text-warmGray-300 group-hover:text-rose-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-semibold text-warmGray-800 mb-1">Chat with AI</h3>
              <p className="text-xs text-warmGray-400">Ask anything about your relationship memories</p>
            </div>
          </Link>
        </motion.div>

        <motion.div variants={item}>
          <Link to="/memories">
            <div className="card p-5 hover:shadow-md transition-all duration-200 group cursor-pointer hover:border-purple-200">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-purple-100 group-hover:scale-105 transition-transform">
                  <BookHeart className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-4 h-4 text-warmGray-300 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-semibold text-warmGray-800 mb-1">Add Memory</h3>
              <p className="text-xs text-warmGray-400">Store a new moment in your story</p>
            </div>
          </Link>
        </motion.div>
      </motion.div>

      {/* Stats */}
      {!loading && stats && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="section-title mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-rose-400" />
            Memory Collection
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(Object.entries(MEMORY_TYPE_CONFIG) as [keyof typeof MEMORY_TYPE_CONFIG, typeof MEMORY_TYPE_CONFIG[keyof typeof MEMORY_TYPE_CONFIG]][]).map(([type, config]) => (
              <div key={type} className={`card p-4 ${config.bg} border ${config.border}`}>
                <div className="text-2xl mb-1">{config.emoji}</div>
                <div className={`text-2xl font-bold font-serif ${config.color} mb-0.5`}>
                  {stats[type] || 0}
                </div>
                <div className={`text-xs ${config.color} opacity-70`}>{config.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 card p-4 bg-gradient-to-br from-rose-50 to-pink-50 border-rose-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-rose-500" />
                  <span className="text-sm font-medium text-rose-700">Total Memories</span>
                </div>
                <div className="text-3xl font-serif font-bold text-rose-600 mt-1">{stats.total}</div>
              </div>
              <Heart className="w-12 h-12 text-rose-200 fill-rose-200" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Recent Memories */}
      {!loading && recentMemories.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title flex items-center gap-2">
              <Calendar className="w-5 h-5 text-rose-400" />
              Recent Memories
            </h2>
            <Link to="/memories" className="text-sm text-rose-500 hover:text-rose-600 font-medium flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentMemories.map((memory) => {
              const config = MEMORY_TYPE_CONFIG[memory.type]
              return (
                <motion.div
                  key={memory.id}
                  whileHover={{ x: 4 }}
                  className="card p-4 flex items-start gap-4 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0 text-lg`}>
                    {config.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`badge ${config.bg} ${config.color} border ${config.border}`}>
                        {config.label}
                      </span>
                      <span className="text-xs text-warmGray-400">
                        {format(new Date(memory.createdAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <h3 className="font-medium text-warmGray-800 text-sm truncate">{memory.title}</h3>
                    <p className="text-xs text-warmGray-400 mt-0.5 line-clamp-1">{memory.content}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}

      {!loading && recentMemories.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <div className="text-6xl mb-4">💝</div>
          <h3 className="font-serif text-xl font-semibold text-warmGray-700 mb-2">Start Your Story</h3>
          <p className="text-warmGray-400 text-sm mb-6">Add your first memory to begin building your relationship archive</p>
          <Link to="/memories" className="btn-primary inline-flex">
            <Heart className="w-4 h-4" /> Add First Memory
          </Link>
        </motion.div>
      )}
    </div>
  )
}
