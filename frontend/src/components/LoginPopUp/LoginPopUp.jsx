import React, { useContext, useState } from 'react'
import './LoginPopUp.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'

const LoginPopUp = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext)

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
      // Build endpoint depending on state
      const endpoint = currState ? '/api/user/login' : '/api/user/register'
      const newUrl = url.endsWith('/') ? url.slice(0, -1) + endpoint : url + endpoint

      const response = await axios.post(newUrl, data)

      // Adjust to the actual server field name. Commonly it's `success` (one s).
      if (response.data && response.data.success) {
        const token = response.data.token
        if (token) {
          setToken(token)
          localStorage.setItem('token', token)
        }
        setShowLogin(false)
      } else {
        // show server message (backend should send something like { message: '...' })
        const msg = response.data?.message || 'Authentication failed'
        alert(msg)
      }
    } catch (err) {
      // Better error reporting so you can debug 409 from server
      if (err.response) {
        // server responded with a status code outside 2xx
        const status = err.response.status
        const serverMsg = err.response.data?.message || JSON.stringify(err.response.data)
        alert(`Error ${status}: ${serverMsg}`)
        console.error('Server error:', status, err.response.data)
      } else if (err.request) {
        // request made but no response
        alert('No response from server. Check backend or network.')
        console.error('No response:', err.request)
      } else {
        alert('Error: ' + err.message)
        console.error('Error:', err.message)
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
          <button type="button" className="close-btn" onClick={() => setShowLogin(false)}>
            <img src={assets.cross_icon} alt="close" />
          </button>
        </div>

        <div className="login-popup-inputs">
          {/* show name only for sign up */}
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

          <button className="login-btn" type="submit" disabled={submitting}>
            {submitting ? 'Please wait...' : currState ? 'Login' : 'Create account'}
          </button>

          <div className="login-popup-condition">
            <label>
              <input className="check" type="checkbox" required />{' '}
              <span>By continuing, I agree to the terms of use & privacy policy</span>
            </label>
          </div>

          {currState ? (
            <p>
              Create a new account? <span onClick={() => setCurrState(false)}>Click here</span>
            </p>
          ) : (
            <p>
              Already have an account? <span onClick={() => setCurrState(true)}>Login here</span>
            </p>
          )}
        </div>
      </form>
    </div>
  )
}

export default LoginPopUp
