const express = require("express");
const router = express.Router();

const {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getLowStock,
  getCategorySummary,
  updateStock
} = require("../controller/productController");

// Product routes
router.post("/", addProduct);
router.get("/", getProducts);

// Keep these routes before /:id
router.get("/low-stock", getLowStock);
router.get("/summary", getCategorySummary);

router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.patch("/:id/stock", updateStock);

module.exports = router;
