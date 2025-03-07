import React from 'react'
import './NewsLetter.css'

const NewsLetter = () => {
  return (
    <div className='newsletter'>
        <h1>Contact Us By Giving Feeback</h1>
        <p>We value your feedback</p>
        <div>
            <input type="email" placeholder='type...' />
            <button>Send</button>
        </div>
    </div>
  )
}

export default NewsLetter