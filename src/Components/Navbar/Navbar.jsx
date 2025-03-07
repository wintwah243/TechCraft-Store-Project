import React, { useContext, useRef, useState } from 'react'
import "./Navbar.css"
import cart_icon from '../Assets/cart_icon.png'
import { Link } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';

const Navbar = () => {
    const [menu,setMenu] = useState("shop");
    const {getTotalCartItems} = useContext(ShopContext);
    const menuRef = useRef();
  return (
    <div className='navbar'>
        <div className="nav-logo">
            <p>Tech<span>Craft</span></p>
        </div>
        <ul ref={menuRef} className="nav-menu">
            <li onClick={() => {setMenu("shop")}}><Link style={{textDecoration:'none',color:'black'}} to='/'>Shop</Link>{menu==="shop"?<hr/>:<></>}</li>
            <li onClick={() => {setMenu("mobilePhone")}}><Link style={{textDecoration:'none',color:'black'}} to='/phone'>Mobile Phone</Link>{menu==="mobilePhone"?<hr/>:<></>}</li>
            <li onClick={() => {setMenu("tablet")}}><Link style={{textDecoration:'none',color:'black'}} to='/tablet'>Tablet</Link>{menu==="tablet"?<hr/>:<></>}</li>
            <li onClick={() => {setMenu("laptop")}}><Link style={{textDecoration:'none',color:'black'}} to='/laptop'>Laptop</Link>{menu==="laptop"?<hr/>:<></>}</li>
        </ul>
        <div className="nav-login-cart">
            {localStorage.getItem('auth-token') ? <button onClick={() => {localStorage.removeItem('auth-token');window.location.replace('/login')}}>Logout</button>:<Link to='/login'><button>Login</button></Link>}
            <Link to='/cart'><img src={cart_icon} alt="" /></Link>
            <div className="nav-cart-count">{getTotalCartItems()}</div>
        </div>
    </div>
  )
}

export default Navbar