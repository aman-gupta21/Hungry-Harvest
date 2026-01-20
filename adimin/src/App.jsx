import React, { useState, useEffect } from 'react';
import Navbar from './components/Sidebar/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import { Routes, Route, Navigate } from 'react-router-dom';
import Add from './pages/Add/Add';
import List from './pages/List/List';
import Orders from './pages/Orders/Orders';
import Login from './pages/Login/Login';
import { ToastContainer } from 'react-toastify';

const App = () => {

const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"
const [isAuthenticated, setIsAuthenticated] = useState(false)
const [loading, setLoading] = useState(true)

const checkAuth = () => {
  // Check if token exists in localStorage
  const token = localStorage.getItem('token')
  const user = localStorage.getItem('user')
  
  if (token && user) {
    try {
      const userData = JSON.parse(user)
      if (userData.role === 'admin') {
        setIsAuthenticated(true)
      } else {
        // Not an admin, clear storage
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setIsAuthenticated(false)
      }
    } catch {
      setIsAuthenticated(false)
    }
  } else {
    setIsAuthenticated(false)
  }
  setLoading(false)
}

useEffect(() => {
  // Check auth on mount
  checkAuth()
  
  // Listen for storage changes (from other tabs/windows)
  const handleStorageChange = () => {
    checkAuth()
  }
  
  window.addEventListener('storage', handleStorageChange)
  
  // Also check periodically in case of same-tab login
  const interval = setInterval(() => {
    checkAuth()
  }, 1000) // Check every 1 second
  
  return () => {
    window.removeEventListener('storage', handleStorageChange)
    clearInterval(interval)
  }
}, [])

if (loading) {
  return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>
}

if (!isAuthenticated) {
  return (
    <div>
      <ToastContainer/>
      <Routes>
        <Route path="/login" element={<Login url={url} />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  )
}

  return (
    <div>
      <ToastContainer/>
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
        <main className="main-view">
          <Routes>
            <Route path="/add" element={<Add url={url} />} />
            <Route path="/list" element={<List url={url} />} />
            <Route path="/orders" element={<Orders url={url} />} />
            <Route path="/login" element={<Navigate to="/orders" />} />
            <Route path="*" element={<Navigate to="/orders" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
