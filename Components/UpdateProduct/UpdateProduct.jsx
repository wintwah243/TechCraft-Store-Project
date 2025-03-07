import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../AddProduct/AddProduct.css';
import upload_area from '../../assets/upload_area.svg';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: '',
    image: '',
    category: 'phone',
    price: '',
  });

  // Fetch product details
  useEffect(() => {
    fetch(`http://localhost:4000/getproduct/${id}`)
      .then((resp) => resp.json())
      .then((data) => {
        setProductDetails({
          name: data.name,
          image: data.image,
          category: data.category,
          price: data.price,
        });
      })
      .catch((err) => console.log(err));
  }, [id]);

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const Update_Product = async () => {
    console.log(productDetails);
    let responseData;
    let updatedProduct = productDetails;

    if (image) {
      let formData = new FormData();
      formData.append('product', image);

      await fetch('http://localhost:4000/upload', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      })
        .then((resp) => resp.json())
        .then((data) => {
          responseData = data;
        });

      if (responseData.success) {
        updatedProduct.image = responseData.image_url;
      }
    }

    await fetch(`http://localhost:4000/updateproduct/${id}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProduct),
    })
      .then((resp) => resp.json())
      .then((data) => {
        data.success ? alert('Product Updated') : alert('Product Updated');
        navigate('/listproduct'); // Redirect to product list
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className='add-product'>
      <div className="addproduct-itemfield">
        <p>Product title</p>
        <input
          value={productDetails.name}
          onChange={changeHandler}
          type="text"
          name='name'
          placeholder='Title'
        />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input
            value={productDetails.price}
            onChange={changeHandler}
            type="text"
            name="price"
            placeholder='Price'
          />
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Product category</p>
        <select
          value={productDetails.category}
          onChange={changeHandler}
          name="category"
          className='add-product-selector'
        >
          <option value="phone">Phone</option>
          <option value="tablet">Tablet</option>
          <option value="laptop">Laptop</option>
        </select>
      </div>
      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          <img
            src={image ? URL.createObjectURL(image) : productDetails.image || upload_area}
            className='addproduct-thumnail-img'
            alt=""
          />
        </label>
        <input onChange={imageHandler} type="file" name="image" id="file-input" hidden />
      </div>
      <button onClick={Update_Product} className='addproduct-btn'>UPDATE PRODUCT</button>
    </div>
  );
};

export default EditProduct;
