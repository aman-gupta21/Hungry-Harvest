import './Navbar.css'
import { assets } from '../../../assets/assets'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const userInfo = localStorage.getItem('user')
    if (userInfo) {
      setUser(JSON.parse(userInfo))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/login')
  }

  if (!user) {
    return (
      <div className="navbar">
        <img className="logo" src={assets.logo} alt="App logo" />
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span>Please login to access admin panel</span>
        </div>
      </div>
    )
  }

  return (
    <div className="navbar">
      <img className="logo" src={assets.logo} alt="App logo" />
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        <span style={{ fontSize: '14px' }}>{user.name} ({user.role})</span>
        <img className="profile" src={assets.profile_image} alt="Profile" />
        <button onClick={handleLogout} style={{
          padding: '8px 16px',
          backgroundColor: '#ff4757',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Logout
        </button>
      </div>
    </div>
  )
}

export default Navbar