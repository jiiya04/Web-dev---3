const mongoose = require("mongoose");

// Product schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    reorderLevel: {
      type: Number,
      default: 5,
      min: 0
    },
    supplier: {
      type: String,
      default: "Not specified"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
