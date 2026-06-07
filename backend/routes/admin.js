const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const Product = require("../models/Product");
const Order = require("../models/Order");

// 👉 ADMIN CHECK
const admin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ msg: "Admin only" });
  }
  next();
};

// ✅ ADD PRODUCT
router.post("/add-product", auth, admin, async (req, res) => {
  try {
    const { name, price, image } = req.body;

    const product = new Product({
      name,
      price,
      image
    });

    await product.save();

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE PRODUCT
router.delete("/delete-product/:id", auth, admin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

    res.json({ msg: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update product
router.put("/update-product/:id", auth, admin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update order status
router.put("/update-order/:id", auth, admin, async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;