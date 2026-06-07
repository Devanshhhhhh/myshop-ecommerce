const express = require('express');
const {
    addToCart,
    getCart,
    removeFromCart
} = require('../controllers/cartController');

const router = express.Router();
const Cart = require("../models/Cart");
const authMiddleware = require('../middleware/authMiddleware');

router.post('/add', authMiddleware, addToCart);
router.get('/', authMiddleware, getCart);
router.post('/remove', authMiddleware, removeFromCart);
router.post("/update", authMiddleware, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ user: req.user.id }).populate("items.product");

    if (!cart) {
      return res.status(404).json({ msg: "Cart not found" });
    }

    // find item
    const item = cart.items.find(
      (i) => i.product._id.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ msg: "Product not in cart" });
    }

    // update quantity safely
    item.quantity = quantity < 1 ? 1 : quantity;

    // ✅ RECALCULATE TOTAL PRICE
    let total = 0;
    cart.items.forEach((i) => {
      total += i.product.price * i.quantity;
    });

    cart.totalPrice = total;

    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;