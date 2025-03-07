import React from 'react'
import './Hero.css'
import arrow_icon from '../Assets/arrow.png'
import header_img from '../Assets/ForIntroPage Background Removed.png'

const Hero = () => {
  return (
    <div className='hero'>
        <div className="hero-left">
            <h2 className='welcome-msg'>Welcome!</h2>
            <div>
                <div className="hand-hand-icon">
                    <p>Our Best</p>
                </div>
                <p>Collections</p>
                <p>For You</p>
            </div>
            <div className="hero-latest-btn">
                <div className='btn-msg'>Our Collections</div>
                <img src={arrow_icon} alt="" />
            </div>
        </div>
        <div className="hero-right">
            <img src={header_img} alt="" />
        </div>
    </div>
  )
}

export default Hero