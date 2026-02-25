import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Heart, MessageCircle, BookHeart, LayoutDashboard, Menu, X, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/chat', icon: MessageCircle, label: 'AI Chat' },
  { path: '/memories', icon: BookHeart, label: 'Memories' },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen bg-paper flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 glass border-r border-warmGray-200 fixed h-full z-20">
        {/* Logo */}
        <div className="p-6 border-b border-warmGray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-warmGray-900 leading-tight">OurStory</h1>
              <p className="text-xs text-warmGray-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-rose-400" /> AI Powered
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ path, icon: Icon, label }) => (
            <NavLink key={path} to={path} className="block">
              {({ isActive }) => (
                <motion.div
                  whileHover={{ x: 4 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-rose-50 text-rose-600 font-medium shadow-sm border border-rose-100'
                      : 'text-warmGray-500 hover:bg-warmGray-50 hover:text-warmGray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-rose-500" />
                  )}
                </motion.div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-warmGray-100">
          <div className="px-4 py-3 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl border border-rose-100">
            <p className="text-xs text-rose-700 font-medium mb-1">Powered by Groq</p>
            <p className="text-xs text-warmGray-400">LLaMA3 · Fast AI Inference</p>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 glass border-b border-warmGray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl flex items-center justify-center">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-serif font-bold text-warmGray-900">OurStory</span>
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg text-warmGray-500 hover:bg-warmGray-100"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black/20 z-20"
              onClick={() => setMobileOpen(false)}
            />
            <motion.nav
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              className="md:hidden fixed top-0 left-0 h-full w-64 glass z-30 pt-16 p-4 space-y-1"
            >
              {navItems.map(({ path, icon: Icon, label }) => (
                <NavLink key={path} to={path} onClick={() => setMobileOpen(false)}>
                  {({ isActive }) => (
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive ? 'bg-rose-50 text-rose-600 font-medium' : 'text-warmGray-500'
                    }`}>
                      <Icon className="w-5 h-5" />
                      <span className="text-sm">{label}</span>
                    </div>
                  )}
                </NavLink>
              ))}
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pt-14 md:pt-0 min-h-screen">
        <div className="h-full">{children}</div>
      </main>
    </div>
  )
}
