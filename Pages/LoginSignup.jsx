import React, { useState, useEffect } from 'react';
import './CSS/LoginSignup.css';
import { useNavigate } from 'react-router-dom';

const LoginSignup = () => {
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: ""
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      navigate("/"); // Redirect to home page if token exists
    }
  }, [navigate]);

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const login = async () => {
    console.log("Login ", formData)
    try {
        const response = await fetch('http://localhost:4000/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json', 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData),
        });

        const responseData = await response.json();

        console.log("Response Data:", responseData);

        if (responseData.success) {
            // Store token in localStorage
            localStorage.setItem('auth-token', responseData.token);
            window.location.href = "/";
        } else {
            alert(responseData.errors);
        }
    } catch (error) {
        console.error("Error during login:", error);
    }
}


  const signup = async () => {
    if (!formData.email || !formData.password || !formData.username) {
      alert("Please fill in all fields");
      return;
    }
    try {
      const response = await fetch('http://localhost:4000/signup', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (responseData.success) {
        localStorage.setItem('auth-token', responseData.token);
        navigate("/"); // Use navigate for redirection
      } else {
        alert(responseData.errors);
      }
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };

  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state === "Sign Up" && (
            <input 
              name='username' 
              value={formData.username} 
              onChange={changeHandler} 
              type="text" 
              placeholder='Name' 
            />
          )}
          <input 
            name='email' 
            value={formData.email} 
            onChange={changeHandler} 
            type="email" 
            placeholder='Email' 
          />
          <input 
            name='password' 
            value={formData.password} 
            onChange={changeHandler} 
            type="password" 
            placeholder='Password' 
          />
        </div>
        <button onClick={() => { state === "Login" ? login() : signup() }}>Submit</button>
        {state === "Sign Up" ? (
          <p className="loginsignup-login">
            Already have an account? 
            <span onClick={() => { setState("Login"); }} style={{ color: 'black' }}>Login here</span>.
          </p>
        ) : (
          <p className="loginsignup-login">
            Don't have an account? 
            <span onClick={() => { setState("Sign Up"); }} style={{ color: 'black' }}>Click here</span>.
          </p>
        )}
        <div className="loginsignup-agree">
          <input type="checkbox" />
          <p>I agree to the terms of use and privacy policy.</p>
        </div>
      </div>
    </div>
  );
}

export default LoginSignup;
