import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, Filter, Trash2, Edit3, X, Save, Calendar,
  BookHeart, SortDesc
} from 'lucide-react'
import { memoryApi } from '../services/api'
import type { RelationshipMemory, CreateMemoryRequest, MemoryType } from '../types'
import { MEMORY_TYPE_CONFIG } from '../types'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const ALL_TYPES = Object.keys(MEMORY_TYPE_CONFIG) as MemoryType[]

const defaultForm: CreateMemoryRequest = {
  type: 'MEMORY',
  title: '',
  content: '',
  date: '',
}

function MemoryForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial: CreateMemoryRequest
  onSave: (data: CreateMemoryRequest) => void
  onCancel: () => void
  saving: boolean
}) {
  const [form, setForm] = useState<CreateMemoryRequest>(initial)

  const set = (field: keyof CreateMemoryRequest, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="card p-6 border-rose-100 bg-gradient-to-br from-rose-50/50 to-white"
    >
      <h3 className="font-serif text-lg font-semibold text-warmGray-800 mb-5">
        {initial.title ? 'Edit Memory' : 'Add New Memory'}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* Type */}
        <div>
          <label className="text-xs font-medium text-warmGray-500 uppercase tracking-wide mb-1.5 block">Type</label>
          <div className="grid grid-cols-3 gap-1.5">
            {ALL_TYPES.map((t) => {
              const cfg = MEMORY_TYPE_CONFIG[t]
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => set('type', t)}
                  className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                    form.type === t
                      ? `${cfg.bg} ${cfg.color} ${cfg.border} shadow-sm`
                      : 'bg-white text-warmGray-400 border-warmGray-200 hover:border-warmGray-300'
                  }`}
                >
                  {cfg.emoji} {cfg.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="text-xs font-medium text-warmGray-500 uppercase tracking-wide mb-1.5 block">
            Date (optional)
          </label>
          <input
            type="date"
            value={form.date || ''}
            onChange={(e) => set('date', e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      {/* Title */}
      <div className="mb-4">
        <label className="text-xs font-medium text-warmGray-500 uppercase tracking-wide mb-1.5 block">Title *</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="Give this memory a title…"
          className="input-field"
        />
      </div>

      {/* Content */}
      <div className="mb-5">
        <label className="text-xs font-medium text-warmGray-500 uppercase tracking-wide mb-1.5 block">Content *</label>
        <textarea
          value={form.content}
          onChange={(e) => set('content', e.target.value)}
          rows={4}
          placeholder="Describe this memory in detail…"
          className="input-field resize-none"
        />
      </div>

      <div className="flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="btn-secondary">
          <X className="w-4 h-4" /> Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            if (!form.title.trim()) return toast.error('Title is required')
            if (!form.content.trim()) return toast.error('Content is required')
            onSave(form)
          }}
          disabled={saving}
          className="btn-primary"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving…' : 'Save Memory'}
        </button>
      </div>
    </motion.div>
  )
}

function MemoryCard({
  memory,
  onEdit,
  onDelete,
}: {
  memory: RelationshipMemory
  onEdit: (m: RelationshipMemory) => void
  onDelete: (id: number) => void
}) {
  const cfg = MEMORY_TYPE_CONFIG[memory.type]
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="card overflow-hidden hover:shadow-md transition-all group"
    >
      <div className={`h-1 ${cfg.bg} border-b ${cfg.border}`} style={{ background: `linear-gradient(to right, var(--tw-gradient-from), var(--tw-gradient-to))` }} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <span className="text-xl mt-0.5">{cfg.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className={`badge ${cfg.bg} ${cfg.color} border ${cfg.border}`}>{cfg.label}</span>
                {memory.date && (
                  <span className="flex items-center gap-1 text-xs text-warmGray-400">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(memory.date), 'MMM d, yyyy')}
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-warmGray-800 text-sm mb-1 truncate">{memory.title}</h3>
              <p className={`text-sm text-warmGray-500 leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>
                {memory.content}
              </p>
              {memory.content.length > 100 && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="text-xs text-rose-500 hover:text-rose-600 mt-1 font-medium"
                >
                  {expanded ? 'Show less' : 'Read more'}
                </button>
              )}
            </div>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <button
              onClick={() => onEdit(memory)}
              className="p-1.5 text-warmGray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(memory.id)}
              className="p-1.5 text-warmGray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-warmGray-50 text-xs text-warmGray-300">
          Added {format(new Date(memory.createdAt), 'MMM d, yyyy · HH:mm')}
        </div>
      </div>
    </motion.div>
  )
}

export default function MemoriesPage() {
  const [memories, setMemories] = useState<RelationshipMemory[]>([])
  const [filtered, setFiltered] = useState<RelationshipMemory[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<RelationshipMemory | null>(null)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<MemoryType | 'ALL'>('ALL')

  const fetchMemories = useCallback(async () => {
    try {
      const data = await memoryApi.getAll()
      setMemories(data)
    } catch {
      toast.error('Failed to load memories')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchMemories() }, [fetchMemories])

  useEffect(() => {
    let result = memories
    if (typeFilter !== 'ALL') result = result.filter((m) => m.type === typeFilter)
    if (search.trim()) {
      const s = search.toLowerCase()
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(s) ||
          m.content.toLowerCase().includes(s)
      )
    }
    setFiltered(result)
  }, [memories, search, typeFilter])

  const handleSave = async (data: CreateMemoryRequest) => {
    setSaving(true)
    try {
      if (editing) {
        const updated = await memoryApi.update(editing.id, data)
        setMemories((prev) => prev.map((m) => (m.id === editing.id ? updated : m)))
        toast.success('Memory updated!')
      } else {
        const created = await memoryApi.create(data)
        setMemories((prev) => [created, ...prev])
        toast.success('Memory saved!')
      }
      setShowForm(false)
      setEditing(null)
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this memory?')) return
    try {
      await memoryApi.delete(id)
      setMemories((prev) => prev.filter((m) => m.id !== id))
      toast.success('Memory deleted')
    } catch {
      toast.error('Failed to delete memory')
    }
  }

  const startEdit = (memory: RelationshipMemory) => {
    setEditing(memory)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelForm = () => {
    setShowForm(false)
    setEditing(null)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <BookHeart className="w-7 h-7 text-rose-500" /> Memories
          </h1>
          <p className="text-sm text-warmGray-400 mt-1">{memories.length} memories stored</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(!showForm) }}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" /> Add Memory
        </button>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div className="mb-6">
            <MemoryForm
              initial={editing
                ? { type: editing.type, title: editing.title, content: editing.content, date: editing.date || '' }
                : defaultForm}
              onSave={handleSave}
              onCancel={cancelForm}
              saving={saving}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="mb-6 space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warmGray-300" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search memories…"
            className="input-field pl-10"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-warmGray-300" />
            </button>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setTypeFilter('ALL')}
            className={`badge border cursor-pointer transition-all ${
              typeFilter === 'ALL'
                ? 'bg-warmGray-800 text-white border-warmGray-800'
                : 'bg-white text-warmGray-500 border-warmGray-200 hover:border-warmGray-300'
            }`}
          >
            <Filter className="w-3 h-3" /> All
          </button>
          {ALL_TYPES.map((t) => {
            const cfg = MEMORY_TYPE_CONFIG[t]
            return (
              <button
                key={t}
                onClick={() => setTypeFilter(t === typeFilter ? 'ALL' : t)}
                className={`badge border cursor-pointer transition-all ${
                  typeFilter === t
                    ? `${cfg.bg} ${cfg.color} ${cfg.border} shadow-sm`
                    : 'bg-white text-warmGray-400 border-warmGray-200 hover:border-warmGray-300'
                }`}
              >
                {cfg.emoji} {cfg.label}
              </button>
            )
          })}
        </div>

        {(search || typeFilter !== 'ALL') && (
          <p className="text-xs text-warmGray-400 flex items-center gap-1">
            <SortDesc className="w-3 h-3" /> Showing {filtered.length} of {memories.length} memories
          </p>
        )}
      </div>

      {/* Memory Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="h-4 bg-warmGray-100 rounded mb-3 w-3/4" />
              <div className="h-3 bg-warmGray-100 rounded mb-2 w-full" />
              <div className="h-3 bg-warmGray-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
          <div className="text-5xl mb-4">{search ? '🔍' : '💝'}</div>
          <h3 className="font-serif text-xl text-warmGray-600 mb-2">
            {search ? 'No matches found' : 'No memories yet'}
          </h3>
          <p className="text-sm text-warmGray-400">
            {search ? 'Try different search terms' : 'Start adding memories to your story'}
          </p>
        </motion.div>
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((memory) => (
              <MemoryCard
                key={memory.id}
                memory={memory}
                onEdit={startEdit}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
