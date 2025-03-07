import React, { createContext, useState, useEffect } from "react";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
    let cart = {};
    for(let index = 0; index < 300+1; index++){
        cart[index] = 0;
    }
    return cart;
}

const ShopContextProvider = (props) => {
    const [all_product,setAllProduct] = useState([]);

    const [cartItems,setCartItems] = useState(getDefaultCart());

    useEffect(() => {
        fetch('http://localhost:4000/allproducts')
        .then((response) => response.json())
        .then((data) => setAllProduct(data))

        if(localStorage.getItem('auth-token')){
            fetch('http://localhost:4000/getcart',{
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json'
                },
                body:""
            }).then((response) => response.json())
            .then((data) => setCartItems(data));
        }
    },[]);
    
    const addToCart = (itemId) => {
        // Optimistic update of cart on client-side
        setCartItems((prev) => ({
          ...prev,
          [itemId]: prev[itemId] ? prev[itemId] + 1 : 1,  // Handles case if the item is not in the cart yet
        }));
      
        // Check if user is authenticated
        if (localStorage.getItem('auth-token')) {
          fetch('http://localhost:4000/addtocart', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'auth-token': `${localStorage.getItem('auth-token')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "itemId": itemId }),
          })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Failed to add item to cart. Status: ${response.status}`);
            }
            return response.json();  // Parse the JSON response
          })
          .then((data) => {
            console.log('Response from backend:', data);
            // You can access the success message and updated cart data here
            // Example: console.log(data.message);
          })
          .catch((error) => {
            console.error("Error adding item to cart:", error);
            // Optional: Revert optimistic update if needed
          });
        }
      }
      
      
    
    
    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({...prev,[itemId]:prev[itemId]-1}));
        if(localStorage.getItem('auth-token')){
            fetch('http://localhost:4000/removefromcart', {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'auth-token': `${localStorage.getItem('auth-token')}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "itemId": itemId }),
              })
              .then((response) => {
                if (!response.ok) {
                  throw new Error(`Failed to add item to cart. Status: ${response.status}`);
                }
                return response.json();  // Parse the JSON response
              })
              .then((data) => {
                console.log('Response from backend:', data);
                // You can access the success message and updated cart data here
                // Example: console.log(data.message);
              })
              .catch((error) => {
                console.error("Error adding item to cart:", error);
                // Optional: Revert optimistic update if needed
              });
            
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for(const item in cartItems){
            if(cartItems[item]>0){
                let itemInfo = all_product.find((product) => product.id===Number(item));
                totalAmount += itemInfo.price * cartItems[item];
            }
        }
        return totalAmount;
    }

    const getTotalCartItems = () => {
        let totalItem = 0;
        for(const item in cartItems){
            if(cartItems[item]>0){
                totalItem += cartItems[item];
            }
        }
        return totalItem;
    }
   
    const contextValue = {getTotalCartItems,getTotalCartAmount,all_product,cartItems,addToCart,removeFromCart};
    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;