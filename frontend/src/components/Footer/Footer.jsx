import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
        <div className="footer-content">
            <div className="footer-content-left">
                <img className="footer-logo" src={assets.logo} alt="Hungry Harvest" />
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla sint culpa quae incidunt assumenda, optio, modi eligendi nemo commodi architecto eaque tempore dolore error id corrupti fuga labore cumque totam!</p>

                <div className="footer-social-icons">
                    <img src={assets.facebook_icon} alt="" />
                    <img src={assets.linkedin_icon} alt="" />
                    <img src={assets.twitter_icon} alt="" />
                </div>
            </div>

            <div className="footer-content-center">
                <h2>COMPANY</h2>
                <ul>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Delivery</li>
                    <li>Privacy policy</li>
                </ul>

            </div>

            <div className="footer-content-right">
                <h2>GET IN TOUCH</h2>
                <ul>
                    <li>+91-6494315423</li>
                    <li>abc@tomato.com</li>

                </ul>
            </div>
        </div>
      
      <hr />
      <p className="footer-copyright">Copyright 2025 © Tomato.com - All Right Reserved.</p>
    </div>
  )
}

export default Footer
