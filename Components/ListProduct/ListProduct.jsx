import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import './ListProduct.css'
import cross_icon from '../../assets/cross_icon.png'

const ListProduct = () => {
    const [allproducts,setAllProducts] = useState([]);

    const fetchInfo = async() => {
        await fetch('http://localhost:4000/allproducts').then((res) => res.json()).then((data) => {setAllProducts(data)});
    }

    useEffect(() => {
        fetchInfo();
    },[]);

    const remove_product = async(id) => {
        await fetch('http://localhost:4000/removeproduct',{
            method: 'POST',
            headers:{
                Accept:'application/json',
                'Content-Type':'application/json',
            },
            body:JSON.stringify({id:id})
        })
        await fetchInfo();
    }
  return (
    <div className='list-product'>
        <h1>All Products List</h1>
        <div className="listproduct-format-main">
            <p>Products</p>
            <p>Title</p>
            <p>Price</p>
            <p>Category</p>
            <p>Remove</p>
            <p>Update</p>
        </div>
        <div className="listproduct-allproducts">
            <hr/>
                {allproducts.map((product,index) => {
                    return <><div key={index} className="listproduct-format-main listproduct-format">
                        <img className='listproduct-product-icon' src={product.image} alt="" />
                        <p>{product.name}</p>
                        <p>${product.price}</p>
                        <p>{product.category}</p>
                        <img onClick={() => {remove_product(product.id)}} className='listproduct-remove-icon' src={cross_icon} alt="" />
                        <Link to={`/updateproduct/${product.id}`} style={{ textDecoration: 'none' }}>
  <button className='update-btn'>Update</button>
</Link>

                    </div>
                    <hr/>
                    </>
                })}
        </div>
    </div>
  )
}

export default ListProduct