import React, { useContext } from 'react';
import './CartItems.css';
import { ShopContext } from '../../Context/ShopContext';
import remove_icon from '../Assets/cart_cross_icon.png';
import {useNavigate} from 'react-router-dom';

const CartItems = () => {
    const navigate = useNavigate();
    const {getTotalCartAmount, all_product, cartItems, removeFromCart } = useContext(ShopContext);

    const handleCheckout = () => {
        const selectedItems = all_product.filter(e => (cartItems[e.id] ?? 0) > 0)
            .map(e => ({ ...e, quantity: cartItems[e.id] }));

        navigate('/checkout', { state: { cartItems: selectedItems, totalAmount: getTotalCartAmount() } });
    };


    return (
        <div className='cartitems'>
            <div className="cartitems-format-main">
                <p>Products</p>
                <p>Title</p>
                <p>Price</p>
                <p>Quantity</p>
                <p>Total</p>
                <p>Remove</p>
            </div>
            <hr />
            {all_product.map((e) => {
                if ((cartItems[e.id] ?? 0) > 0) {
                    return (
                        <div className="cartitems-format cartitems-format-main" key={e.id}>
                            <img src={e.image} className='carticon-product-icon' alt={e.name} />
                            <p>{e.name}</p>
                            <p>${e.price}</p>
                            <button className='cartitems-quantity'>{cartItems[e.id]}</button>
                            <p>${e.price * cartItems[e.id]}</p>
                            <img 
                                src={remove_icon} 
                                onClick={() => removeFromCart(e.id)} 
                                alt="Remove" 
                                className="cart-remove-icon"
                            />
                            <hr />
                        </div>
                    );
                }
                return null;
            })}
            <div className="cartitems-down">
                <div className="cartitems-total">
                    <h1>Cart Total</h1>
                    <div>
                        <div className="cartitems-total-item">
                            <p>Subtotal</p>
                            <p>${getTotalCartAmount()}</p>
                        </div>
                        <hr/>
                        <div className="cartitems-total-item">
                            <p>Delivery Fee</p>
                            <p>Free</p>
                        </div>
                        <hr/>
                        <div className="cartitems-total-item">
                            <h3>Total</h3>
                            <h3>${getTotalCartAmount()}</h3>
                        </div>
                    </div>
                    <button onClick={handleCheckout}>Make Payment</button>
                </div>
            </div>
        </div>
    );
}

export default CartItems;
