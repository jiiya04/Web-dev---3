const express = require("express");
require("dotenv").config();

const connectDB = require("./database/db");
const productRoutes = require("./routes/productRoutes");

const app = express();

// Read JSON data sent by Postman
app.use(express.json());

// Connect to MongoDB
connectDB();

// Home route
app.get("/", (req, res) => {
  res.send("Inventory Management System is running");
});

// Use product routes
app.use("/api/products", productRoutes);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
