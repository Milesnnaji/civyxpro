import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Sidebar from './components/Sidebar'

// Pages
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Builder from './pages/Builder'
import { Templates, Marketplace, Payments, Profile } from './pages/Pages'

// Layout wrapper for authenticated pages
function AppLayout() {
  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <main className="flex-1 ml-[220px] overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  )
}

// Route guard
function PrivateRoute() {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="text-muted font-syne">Loading...</div>
    </div>
  )
  return user ? <AppLayout /> : <Navigate to="/auth" replace />
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? <Navigate to="/dashboard" replace /> : children
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={
            <PublicRoute><Auth /></PublicRoute>
          } />

          {/* Protected */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard"   element={<Dashboard />} />
            <Route path="/builder"     element={<Builder />} />
            <Route path="/builder/:id" element={<Builder />} />
            <Route path="/templates"   element={<Templates />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/payments"    element={<Payments />} />
            <Route path="/profile"     element={<Profile />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
