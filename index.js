const port = 4000;
const express = require("express");
const app = express();
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const {Sequelize,DataTypes} = require('sequelize');

app.use(express.json());
app.use(cors());

const sequelize = new Sequelize('Electrohub','root','shishi243',{
    host:'localhost',
    dialect:'mysql',
    logging:false
});

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "shishi243",
    database: "Electrohub"
});

app.get("/", (req, res) => {
    res.send("Express App is Running");
});

// Image Storage
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

// Creating upload endpoint for images
app.use('/images', express.static('upload/images'));

app.post("/upload", upload.single('product'), (req, res) => {
    // Error handling if no file is uploaded
    if (!req.file) {
        return res.status(400).json({ success: 0, message: "No file uploaded" });
    }

    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    });
});

//Schema for creating products
const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Auto-increment field
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false, // Equivalent to `required: true` in Mongoose
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW, // Equivalent to `default: Date.now` in Mongoose
    },
    available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, // Equivalent to `default: true` in Mongoose
    }
  }, {
    tableName: 'products', // Optional: specify custom table name if needed
    timestamps: false, // Optional: disables auto-adding of `createdAt` and `updatedAt` fields if not needed
  });
  

  app.post('/addproduct', async (req, res) => {
    let products = await Product.findAll();

    try {
        const { id, name, image, category, price } = req.body;

        // Create a new product in the database
        const product = await Product.create({
            id,  // This is auto-incremented, so you may not need to pass it
            name,
            image,
            category,
            price
        });

        console.log(product);

        // Send a success response
        res.status(201).json({ message: 'Product added successfully', product });
    } catch (err) {
        console.error('Error adding product:', err);
        res.status(500).json({ message: 'Error adding product', error: err.message });
    }
});

// Deleting products with Sequelize
app.post('/removeproduct', async (req, res) => {
    try {
        // Find the product by id and delete it
        const product = await Product.destroy({
            where: { id: req.body.id }
        });

        // If no product is found and deleted
        if (product === 0) {
            return res.json({
                success: false,
                message: "Product not found or already deleted"
            });
        }

        console.log("Remove");
        res.json({
            success: true,
            message: `Product with id ${req.body.id} removed successfully`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error while deleting the product"
        });
    }
});

// Displaying all products with Sequelize
app.get('/allproducts', async (req, res) => {
    try {
        // Fetch all products from the database
        let products = await Product.findAll();

        console.log("All products display");

        // Send the products as a JSON response
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error while fetching products"
        });
    }
});

//Creating User 
const Users = sequelize.define('Users', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cartData: {
      type: DataTypes.JSON // Sequelize supports JSON objects for structured data
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    timestamps: false // Disable `createdAt` and `updatedAt` fields (optional)
  });

  const Orders = sequelize.define('Orders', {
    orderId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', // Refers to the Users table
            key: 'ID' // The primary key of the Users table
        },
        onDelete: 'CASCADE' // Optional: delete orders when a user is deleted
    },
    items: {
        type: DataTypes.JSON,
        allowNull: false
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    cardNumber: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW
    }
}, {
    timestamps: false // Optional: Disable automatic `createdAt` and `updatedAt` fields if needed
});

  //Creating endpoint for registering the user
  app.post('/signup', async (req, res) => {
    console.log("Checking for existing user with email:", req.body.email);

    let check = await Users.findOne({ where: { email: req.body.email } });

    console.log("User found:", check); // 🔥 Debugging line

    if (check) {
        return res.status(400).json({ success: false, errors: "existing user found with same email" });
    }

    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i] = 0;
    }

    const user = await Users.create({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData: cart,
    });

    const data = {
        user: {
            id: user.id
        }
    };
    
    const token = jwt.sign(data, 'secret_ecom');
    res.json({ success: true, token });
});


  app.post('/login', async (req, res) => {
    try {
        let user = await Users.findOne({ 
            where: { email: req.body.email } // ✅ Correct way to find a user by email
        });

        if (user) {
            const passCompare = req.body.password === user.password; // Replace with bcrypt comparison if needed
            if (passCompare) {
                const data = {
                    user: {
                        id: user.id
                    }
                };
                const token = jwt.sign(data, 'secret_ecom');
                return res.json({ success: true, token });
            } else {
                return res.json({ success: false, errors: "Wrong Password" });
            }
        } else {
            return res.json({ success: false, errors: "Wrong Email address" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, errors: "Server Error" });
    }
});

app.get('/newcollection', async (req, res) => {
    try {
        const products = await Product.findAll({
            limit: 8,  // Limit to last 8 items
            order: [['date', 'DESC']]  // Use 'date' field to order products
        });
        
        console.log("New collections display");
        res.json(products);
    } catch (error) {
        console.error("Error fetching new collections:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Creating endpoint for popular items using Sequelize
app.get('/popularitem', async (req, res) => {
    try {
        // Fetch products with the category "laptop" and limit the results to 4
        const popular_in_laptop = await Product.findAll({
            where: {
                category: 'phone'
            },
            limit: 4,  // Limit to 4 products
        });

        console.log("Popular display");
        res.json(popular_in_laptop);
    } catch (error) {
        console.error("Error fetching popular items:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

//creating middlware to fetch user
const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    
    if (!token) {
        return res.status(401).send({ errors: "Please authenticate using a valid token" });
    }
    
    try {
        // Verify the JWT token using the secret key
        const data = jwt.verify(token, 'secret_ecom');
        
        // Find the user in the database by the id stored in the JWT token
        const user = await Users.findOne({ where: { id: data.user.id } });
        
        // If no user is found, return an error
        if (!user) {
            return res.status(401).send({ errors: "User not found" });
        }

        // Attach the user data to the request object so it can be accessed in the route handler
        req.user = user;
        next();  // Move to the next middleware or route handler

    } catch (error) {
        console.error('JWT verification error:', error);
        res.status(401).send({ errors: "Please authenticate using a valid token" });
    }
};

// Creating endpoint for adding products to cart data using Sequelize
app.post('/addtocart', fetchUser, async (req, res) => {
    console.log("added",req.body.itemId);
    try {
      // Fetch the user data using the user's id
      const userData = await Users.findOne({
        where: { id: req.user.id },
      });
  
      if (!userData) {
        return res.status(404).json({ message: "User not found" });
      }
  
      console.log("Original cart data:", userData.cartData);
  
      // Ensure cartData is initialized as an object (empty object if not present)
      let updatedCartData = userData.cartData || {};
      console.log("Updated cart data before modification:", updatedCartData);
  
      // Increment the item in cartData or add it if it doesn't exist
      updatedCartData[req.body.itemId] = (updatedCartData[req.body.itemId] || 0) + 1;
      console.log("Updated cart data after modification:", updatedCartData);
  
      // Update the user's cartData in the database
      const updatedUser = await userData.update({
        cartData: updatedCartData, // Save as an object directly
      });
  
      // Log the updated user to confirm if the cart was updated successfully
      console.log("Updated user after saving:", updatedUser.cartData);
  
      // Send success message in JSON format
      res.json({ message: "Item added to cart successfully", updatedCartData });
    } catch (error) {
      console.error("Error adding to cart:", error);  // Log the error for debugging
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
   

//creating endpoint to remove product from cart
app.post('/removefromcart', fetchUser, async (req, res) => {
    try {
      console.log("Removing item", req.body.itemId);
      
      // Find the user based on user id
      let userData = await Users.findOne({
        where: { id: req.user.id }, // Make sure you're using `id` here
      });
  
      // Check if cartData exists
      if (!userData || !userData.cartData) {
        return res.status(400).json({ message: "Cart data not found" });
      }
  
      // Check if the item exists in the cart and has quantity greater than 0
      if (userData.cartData[req.body.itemId] > 0) {
        userData.cartData[req.body.itemId] -= 1;  // Decrease item count
      } else {
        return res.status(400).json({ message: "Item not found in cart or already removed" });
      }
  
      // Update the user's cartData in the database
      await userData.update({
        cartData: userData.cartData,  // Save updated cartData
      });
  
      res.send("Item removed from cart");
    } catch (error) {
      console.error("Error removing item from cart:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  //creating endpoint to get cartdata
  app.post('/getcart', fetchUser, async (req, res) => {
    try {
      console.log("get cart item");
  
      // Log the request body to ensure the item is being passed correctly
      console.log("Request Body:", req.body);
  
      // Find the user
      let userData = await Users.findOne({ _id: req.user.id });
  
      // Check if user exists
      if (!userData) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Add item to the cart
      let newItem = req.body.item;
  
      if (!newItem) {
        return res.status(400).json({ message: "No item provided in the request body" });
      }
  
      // If the user has no cartData, initialize it as an empty array
      if (!userData.cartData) {
        userData.cartData = [];
      }
  
      // Push the new item to the cartData array
      userData.cartData.push(newItem);
  
      // Make sure cartData is properly formatted as a JSON string for MySQL
      const updatedCartData = JSON.stringify(userData.cartData);  // Stringify the cartData for MySQL JSON type
  
      // Save the updated user data
      userData.cartData = updatedCartData;
  
      // Log the updated data before saving
      console.log("Data before save:", userData.cartData);
  
      const result = await userData.save();
  
      // Log the result of save
      console.log("User data after save:", result);
  
      // Check if result is successful
      if (result) {
        console.log("Save successful!");
      } else {
        console.log("Save failed!");
      }
  
      // Send the updated cart data as the response
      res.json(result ? result.cartData : {});
  
    } catch (error) {
      console.error("Error adding item to cart:", error);
      res.status(500).json({ message: "Error adding item to cart" });
    }
  });
  
//update product
app.put('/updateproduct/:id', async (req, res) => {
    const { id } = req.params;
    const { name, image, category, price } = req.body;

    try {
        // Find the product by ID
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Update product details
        await product.update({
            name,
            image,
            category,
            price
        });

        console.log('Product updated:', product);

        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).json({ message: 'Error updating product', error: err.message });
    }
});

//add order
app.post('/addorder', async (req, res) => {
    try {
        const { userId, items, totalAmount, name, address, cardNumber } = req.body;

        // Ensure valid userId and other parameters
        if (!userId || !items || !Array.isArray(items) || items.length === 0 || !totalAmount || !name || !address || !cardNumber) {
            return res.status(400).json({ message: "All fields are required and items must be an array" });
        }

        // Check if the userId exists in the users table
        const userExists = await Users.findOne({ where: { ID: userId } }); // Use 'ID' here

        if (!userExists) {
            return res.status(400).json({ message: "User not found with the provided userId" });
        }

        // Create a new order
        const formattedItems = items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
        }));

        const order = await Orders.create({
            userId,
            items: JSON.stringify(formattedItems),  // Store items as a JSON string
            totalAmount,
            name,
            address,
            cardNumber
        });

        console.log("Order placed:", order);

        // Send a success response
        res.status(201).json({ message: 'Order placed successfully', order });

    } catch (err) {
        console.error('Error placing order:', err);
        res.status(500).json({
            message: 'Error placing order',
            error: err.message,
            stack: err.stack // For better debugging
        });
    }
});


app.listen(port, (error) => {
    if (!error) {
        console.log("Server Running on Port " + port);
    } else {
        console.log("Error: " + error);
    }
});

module.exports = Product;
module.exports = Users;
module.exports = fetchUser;
module.exports = Orders;
