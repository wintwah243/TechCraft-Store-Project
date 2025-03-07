import React from 'react'
import './Footer.css'

const Footer = () => {
  return (
    <div className='footer'>
        <div className="footer-logo">
            <p>Tech<span>Craft</span></p>
        </div>
        <ul className="footer-links">
            <li>Company</li>
            <li>Product</li>
            <li>Office</li>
            <li>About</li>
            <li>Contact</li>
        </ul>
        <div className="footer-copyright">
            <hr/>
            <p>Copyright @ 2025 - All rights reserved.</p>
        </div>
    </div>
  )
}

export default Footer