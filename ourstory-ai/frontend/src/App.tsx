import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ChatPage from './pages/ChatPage'
import MemoriesPage from './pages/MemoriesPage'
import DashboardPage from './pages/DashboardPage'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/memories" element={<MemoriesPage />} />
      </Routes>
    </Layout>
  )
}
