import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Sparkles, Heart, RefreshCcw } from 'lucide-react'
import { chatApi } from '../services/api'
import type { ChatMessage } from '../types'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const SUGGESTED_QUESTIONS = [
  'How did we first meet?',
  'What are her favorite things?',
  'What special events do we have coming up?',
  'Tell me about our best memory together',
]

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const response = await chatApi.sendMessage(text.trim())
      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.reply,
        timestamp: new Date(response.timestamp),
        memoriesUsed: response.memoriesUsed,
      }
      setMessages((prev) => [...prev, aiMsg])
    } catch (err) {
      toast.error((err as Error).message || 'Failed to get AI response')
      setMessages((prev) => prev.filter((m) => m.id !== userMsg.id))
      setInput(text)
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const clearChat = () => {
    setMessages([])
    toast.success('Conversation cleared')
  }

  return (
    <div className="flex flex-col h-screen md:h-screen">
      {/* Header */}
      <div className="glass border-b border-warmGray-100 px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-serif font-semibold text-warmGray-900">OurStory AI</h1>
            <p className="text-xs text-warmGray-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block" />
              Powered by Groq · LLaMA3
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="text-warmGray-400 hover:text-warmGray-600 p-2 rounded-lg hover:bg-warmGray-100 transition-all"
            title="Clear conversation"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-rose-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-inner">
              <Heart className="w-10 h-10 text-rose-400 fill-rose-300" />
            </div>
            <h2 className="font-serif text-xl font-semibold text-warmGray-800 mb-2">
              Ask About Your Story
            </h2>
            <p className="text-sm text-warmGray-400 mb-8 max-w-xs mx-auto">
              I have access to all your relationship memories and can answer questions about your journey together.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg mx-auto">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-left px-4 py-3 rounded-xl bg-white border border-warmGray-100 hover:border-rose-200 hover:bg-rose-50 transition-all text-sm text-warmGray-600 hover:text-rose-700 shadow-sm"
                >
                  <Sparkles className="w-3 h-3 text-rose-400 inline mr-1.5" />
                  {q}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 ${
                msg.role === 'user'
                  ? 'bg-rose-500'
                  : 'bg-gradient-to-br from-purple-400 to-pink-400'
              }`}>
                {msg.role === 'user'
                  ? <User className="w-4 h-4 text-white" />
                  : <Bot className="w-4 h-4 text-white" />
                }
              </div>

              {/* Bubble */}
              <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
                <div className={`text-sm leading-relaxed whitespace-pre-wrap ai-prose ${
                  msg.role === 'user' ? 'text-white' : 'text-warmGray-800'
                }`}>
                  {msg.content}
                </div>
                <div className={`flex items-center gap-2 mt-1.5 text-xs ${
                  msg.role === 'user' ? 'text-rose-200 justify-end' : 'text-warmGray-400'
                }`}>
                  <span>{format(msg.timestamp, 'HH:mm')}</span>
                  {msg.role === 'assistant' && msg.memoriesUsed !== undefined && (
                    <span className="flex items-center gap-1">
                      · <Heart className="w-2.5 h-2.5 fill-current" /> {msg.memoriesUsed} memories
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 items-center"
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-purple-400 to-pink-400">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="chat-bubble-ai">
              <div className="flex items-center gap-1 py-1">
                <span className="typing-dot text-rose-400" />
                <span className="typing-dot text-rose-400" />
                <span className="typing-dot text-rose-400" />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="glass border-t border-warmGray-100 px-4 py-4 flex-shrink-0">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your memories…"
            className="input-field flex-1"
            disabled={loading}
            autoFocus
          />
          <motion.button
            type="submit"
            disabled={!input.trim() || loading}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center
                       text-white shadow-lg shadow-rose-200 hover:shadow-rose-300 transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </form>
      </div>
    </div>
  )
}
