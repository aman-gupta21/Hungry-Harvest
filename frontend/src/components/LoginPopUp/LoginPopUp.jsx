import React, { useContext, useState } from 'react'
import './LoginPopUp.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'

// ✅ Vite env variable
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const LoginPopUp = ({ setShowLogin }) => {
  const { setToken } = useContext(StoreContext)

  // true => Login, false => Sign up
  const [currState, setCurrState] = useState(true)

  const [data, setData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const [submitting, setSubmitting] = useState(false)

  const onChangeHandler = (event) => {
    const { name, value } = event.target
    setData(prev => ({ ...prev, [name]: value }))
  }

  const onLogin = async (event) => {
    event.preventDefault()
    if (submitting) return
    setSubmitting(true)

    try {
      const endpoint = currState
        ? '/api/user/login'
        : '/api/user/register'

      // ✅ safe URL join
      const url = `${BACKEND_URL}${endpoint}`

      const response = await axios.post(url, data)

      if (response.data?.success) {
        const token = response.data.token
        const user = response.data.user
        
        setToken(token)
        localStorage.setItem('token', token)
        
        // Store user info for admin panel
        if (user) {
          localStorage.setItem('user', JSON.stringify(user))
        }
        
        setShowLogin(false)
      } else {
        alert(response.data?.message || 'Authentication failed')
      }
    } catch (err) {
      if (err.response) {
        alert(`Error ${err.response.status}: ${err.response.data?.message}`)
        console.error(err.response.data)
      } else {
        alert('Server not reachable')
        console.error(err)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState ? 'Login' : 'Sign up'}</h2>
          <button type="button" onClick={() => setShowLogin(false)}>
            <img src={assets.cross_icon} alt="close" />
          </button>
        </div>

        <div className="login-popup-inputs">
          {!currState && (
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="Your Name"
              required
            />
          )}

          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Email Address"
            required
          />

          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder="Password"
            required
          />

          <button type="submit" disabled={submitting}>
            {submitting ? 'Please wait...' : currState ? 'Login' : 'Create account'}
          </button>

          <label className="login-popup-condition">
            <input type="checkbox" required />
            <span>By continuing, I agree to the terms & privacy policy</span>
          </label>

          {currState ? (
            <p>
              Create a new account?{' '}
              <span onClick={() => setCurrState(false)}>Click here</span>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <span onClick={() => setCurrState(true)}>Login here</span>
            </p>
          )}
        </div>
      </form>
    </div>
  )
}

export default LoginPopUp
