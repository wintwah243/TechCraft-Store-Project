import React from 'react'
import './Popular.css'
import {useState, useEffect} from 'react'
import Item from '../Item/Item'

const Popular = () => {
  const [popularProducts,setPopularProducts] = useState([]);
  useEffect(() => {
    fetch('http://localhost:4000/popularitem')
    .then((response) => response.json())
    .then((data) => setPopularProducts(data))
  },[]);
  return (
    <div className='popular'>
        <h1>Popular Items</h1>
        <hr/>
        <div className="popular-item">
            {popularProducts.map((item,i) => {
                return <Item key={i} id={item.id} name={item.name} image={item.image} price={item.price}/>
            })}
        </div>
    </div>
  )
}

export default Popular