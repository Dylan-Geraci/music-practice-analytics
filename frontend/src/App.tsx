import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import SongsPage from '@/pages/SongsPage'
import SessionsPage from '@/pages/SessionsPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/songs" element={<SongsPage />} />
        <Route path="/sessions" element={<SessionsPage />} />
      </Route>
    </Routes>
  )
}

export default App
