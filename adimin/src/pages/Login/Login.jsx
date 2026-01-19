import React, { useState } from 'react'
import './Login.css'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = ({ url }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      return toast.error('Please fill all fields')
    }

    try {
      setLoading(true)
      const response = await axios.post(`${url}/api/user/login`, {
        email,
        password
      })

      if (response.data.success) {
        const user = response.data.user
        
        // Check if user is admin
        if (user.role !== 'admin') {
          toast.error('You do not have admin access')
          return
        }

        // Store token and user info
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(user))
        
        // Trigger storage event for other components/tabs
        window.dispatchEvent(new Event('storage'))
        
        toast.success('Login successful!')
        
        // Wait a moment for state to update, then navigate
        setTimeout(() => {
          navigate('/orders')
        }, 500)
      } else {
        toast.error(response.data.message || 'Login failed')
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              disabled={loading}
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="info-text">
          Note: Only users with admin role can access this panel.
        </p>
      </div>
    </div>
  )
}

export default Login
