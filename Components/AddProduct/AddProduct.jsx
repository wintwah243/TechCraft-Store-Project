import React, { useState } from 'react'
import './AddProduct.css'
import upload_area from '../../assets/upload_area.svg'
import { useNavigate } from 'react-router-dom'

const AddProduct = () => {
    const [image,setImage] = useState(false);
    const [productDetails,setProductDetails] = useState({
        name:"",
        image:"",
        category:"phone",
        price:""
    })
    const navigate = useNavigate();

    const imageHandler = (e) => {
        setImage(e.target.files[0]);
    }

    const changeHandler = (e) => {
        setProductDetails({...productDetails,[e.target.name]:e.target.value })
    }

    const Add_Product = async() => {
        console.log(productDetails);
        let responseData;
        let product = productDetails;

        let formData = new FormData();
        formData.append('product', image);

        await fetch('http://localhost:4000/upload',{
            method:'POST',
            headers:{
                Accept:'application/json',
            },
            body:formData,
        }).then((resp) => resp.json()).then((data) => {responseData = data});
        if(responseData.success){
            product.image = responseData.image_url;
            console.log(product);
            await fetch('http://localhost:4000/addproduct',{
                method:'POST',
                headers:{
                    Accept:'application/json',
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(product),
            }).then((resp) => resp.json()).then((data) => {
                data.success ? alert("Product Added") : alert("Product Added");
                navigate('/listproduct');
            })
        }
    }
  return (
    <div className='add-product'>
        <div className="addproduct-itemfield">
            <p>Product title</p>
            <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='title' />
        </div>
        <div className="addproduct-price">
            <div className="addproduct-itemfield">
                <p>Price</p>
                <input value={productDetails.price} onChange={changeHandler} type="text" name="price" placeholder='price' />
            </div>
        </div>
        <div className="addproduct-itemfield">
            <p>Product category</p>
            <select value={productDetails.category} onChange={changeHandler} name="category" className='add-product-selector'>
                <option value="phone">Phone</option>
                <option value="tablet">Tablet</option>
                <option value="laptop">Laptop</option>
            </select>
        </div>
        <div className="addproduct-itemfield">
            <label htmlFor="file-input">
                <img src={image ? URL.createObjectURL(image) : upload_area} className='addproduct-thumnail-img' alt="" />
            </label>
            <input onChange={imageHandler} type="file" name="image" id="file-input" hidden />
        </div>
        <button onClick={() => {Add_Product()}} className='addproduct-btn'>ADD PRODUCT</button>
    </div>
  )
}

export default AddProduct