import React, { useContext, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { CiSearch } from "react-icons/ci"
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("menu")
  const [showDropdown, setShowDropdown] = useState(false)

  const { getTotalCartAmount, token, setToken } = useContext(StoreContext)
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem("token")
    setToken("")
    setShowDropdown(false)
    navigate("/")
  }

  return (
    <div className='navbar'>
      <Link to='/'>
        <img className="logo" src={assets.logo} alt="Hungry Harvest" />
      </Link>

      <ul className="navbar-menu">
        <li>
          <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>
            home
          </Link>
        </li>
        <li>
          <a href='#explore-menu' onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>
            menu
          </a>
        </li>
        <li>
          <a href='#app-download' onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>
            mobile-app
          </a>
        </li>
        <li>
          <a href='#footer' onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>
            contact us
          </a>
        </li>
      </ul>

      <div className="navbar-right">
        <CiSearch size={36} />

        <div className="navbar-search-icon">
          <Link to='/cart'>
            <img src={assets.basket_icon} alt="cart" />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>

        {!token ? (
  <button onClick={() => setShowLogin(true)}>sign in</button>
) : (
  <div
    className="navbar-profile"
    onClick={() => setShowDropdown(prev => !prev)}
  >
    <img
      src={assets.profile_icon}
      alt="profile"
      className="profile-icon"
    />

    {showDropdown && (
      <ul onClick={(e) => e.stopPropagation()} className="nav-profile-dropdown">
        <li
          onClick={() => {  
            navigate('/myorders')
            setShowDropdown(false)
          }}
        >
          <img src={assets.bag_icon} alt="" />
          <p>Orders</p>
        </li>
        <hr />
        <li onClick={logout}>
          <img src={assets.logout_icon} alt="" />
          <p>Logout</p>
        </li>
      </ul>
    )}
  </div>
)}
      </div>
    </div>
  )
}

export default Navbar
