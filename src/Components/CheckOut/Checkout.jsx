import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Checkout.css';  // Add your styles for checkout
import { useContext } from 'react';
import { ShopContext } from '../../Context/ShopContext';

const Checkout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { cartItems, getTotalCartAmount, all_product } = useContext(ShopContext);

    const { cartItems: selectedItems, totalAmount } = location.state || {};

    const [userInfo, setUserInfo] = useState({
        name: '',
        address: '',
        cardNumber: ''
    });

    const changeHandler = (e) => {
        setUserInfo({
            ...userInfo,
            [e.target.name]: e.target.value
        });
    };

    const handleCheckout = async () => {
        const userId = localStorage.getItem('userId');  // Get the actual user ID from localStorage

        if (!userId) {
            alert('order confirmed!');
            navigate('/');
            return;
        }

        // Map the selected items to match the backend format
        const orderData = {
            userId, 
            items: selectedItems.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            })),
            totalAmount,
            name: userInfo.name,
            address: userInfo.address,
            cardNumber: userInfo.cardNumber
        };

        try {
            const response = await fetch('http://localhost:4000/addorder', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            const data = await response.json();
            if (data.success) {
                alert('Checkout successful!');
                navigate('/'); // Navigate to order confirmation page
            } else {
                alert('Checkout confirmed!');
            }
        } catch (error) {
            console.error('Error during checkout:', error);
            alert('An error occurred during checkout. Please try again later.');
        }
    };

    return (
        <div className="checkout">
            <h1>Checkout</h1>
            <div className="checkout-form">
                <div className="checkout-field">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={userInfo.name}
                        onChange={changeHandler}
                        placeholder="Enter your name"
                    />
                </div>
                <div className="checkout-field">
                    <label htmlFor="address">Address:</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={userInfo.address}
                        onChange={changeHandler}
                        placeholder="Enter your address"
                    />
                </div>
                <div className="checkout-field">
                    <label htmlFor="cardNumber">Card Number:</label>
                    <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={userInfo.cardNumber}
                        onChange={changeHandler}
                        placeholder="Enter your card number"
                    />
                </div>
            </div>

            <div className="checkout-summary">
                <h2>Order Summary</h2>
                <div>
                    <p><strong>Total Amount: </strong>${totalAmount}</p>
                </div>
                <button className="checkoutbtn" onClick={handleCheckout}>Complete Purchase</button>
            </div>
        </div>
    );
};

export default Checkout;
