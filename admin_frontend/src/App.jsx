import { useEffect, useState } from 'react'
import { Flex, Spin } from 'antd'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import GalleryPage from './pages/GalleryPage'
import OrdersPage from './pages/OrdersPage'

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('bigsofa-admin-token'))
  const [initialised, setInitialised] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setInitialised(true)
  }, [])

  useEffect(() => {
    if (initialised) {
      if (!token && location.pathname !== '/login') {
        navigate('/login', { replace: true })
      } else if (token && location.pathname === '/login') {
        navigate('/', { replace: true })
      }
    }
  }, [token, initialised, location.pathname, navigate])

  const handleAuthenticated = (newToken) => {
    localStorage.setItem('bigsofa-admin-token', newToken)
    setToken(newToken)
    navigate('/', { replace: true })
  }

  const handleLogout = () => {
    localStorage.removeItem('bigsofa-admin-token')
    setToken(null)
    navigate('/login', { replace: true })
  }

  if (!initialised) {
    return (
      <Flex align="center" justify="center" style={{ minHeight: '100vh' }}>
        <Spin size="large" />
      </Flex>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage onAuthenticated={handleAuthenticated} />} />
      <Route path="/" element={<DashboardPage token={token} onLogout={handleLogout} />} />
      <Route path="/gallery" element={<GalleryPage token={token} onLogout={handleLogout} />} />
      <Route path="/orders" element={<OrdersPage token={token} onLogout={handleLogout} />} />
    </Routes>
  )
}

export default App
