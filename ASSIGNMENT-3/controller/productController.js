const Product = require("../model/Product");

// Add a new product
const addProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all products with search, filter, sorting and pagination
const getProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    let filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.search) {
      filter.name = { $regex: req.query.search, $options: "i" };
    }

    const sortBy = req.query.sort || "name";
    const order = req.query.order === "desc" ? -1 : 1;
    const sortOptions = {};
    sortOptions[sortBy] = order;

    const products = await Product.find(filter)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Product.countDocuments(filter);

    res.json({
      total: total,
      page: page,
      totalPages: Math.ceil(total / limit),
      products: products
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get one product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({ message: "Invalid product ID" });
  }
};

// Update product details
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid product ID" });
  }
};

// Show products with low stock
const getLowStock = async (req, res) => {
  try {
    const products = await Product.find({
      $expr: { $lte: ["$quantity", "$reorderLevel"] }
    });

    res.json({
      count: products.length,
      lowStockProducts: products
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Show category-wise inventory summary
const getCategorySummary = async (req, res) => {
  try {
    const summary = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          totalItems: { $sum: 1 },
          totalQuantity: { $sum: "$quantity" },
          totalStockValue: {
            $sum: { $multiply: ["$price", "$quantity"] }
          },
          averagePrice: { $avg: "$price" }
        }
      }
    ]);

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Increase or decrease product stock
const updateStock = async (req, res) => {
  try {
    const change = Number(req.body.change);

    if (Number.isNaN(change) || change === 0) {
      return res.status(400).json({ message: "Enter a non-zero stock change" });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.quantity + change < 0) {
      return res.status(400).json({ message: "Stock cannot be negative" });
    }

    product.quantity = product.quantity + change;
    await product.save();

    res.json({
      message: "Stock updated successfully",
      product: product
    });
  } catch (error) {
    res.status(400).json({ message: "Invalid product ID or stock value" });
  }
};

module.exports = {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getLowStock,
  getCategorySummary,
  updateStock
};
