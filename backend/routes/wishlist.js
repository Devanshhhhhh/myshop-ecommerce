const express = require("express");
const router = express.Router();
const Wishlist = require("../models/Wishlist");
const auth = require("../middleware/authMiddleware");

// ✅ Get wishlist
router.get("/", auth, async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user.id })
    .populate("products");

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user.id, products: [] });
  }

  res.json(wishlist);
});

// ✅ Add to wishlist
router.post("/add", auth, async (req, res) => {
  const { productId } = req.body;

  let wishlist = await Wishlist.findOne({ user: req.user.id });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: req.user.id,
      products: []
    });
  }

  if (!wishlist.products.includes(productId)) {
    wishlist.products.push(productId);
  }

  await wishlist.save();

  res.json(wishlist);
});

// ✅ Remove from wishlist
router.post("/remove", auth, async (req, res) => {
  const { productId } = req.body;

  let wishlist = await Wishlist.findOne({ user: req.user.id });

  wishlist.products = wishlist.products.filter(
    (p) => p.toString() !== productId
  );

  await wishlist.save();

  res.json(wishlist);
});

module.exports = router;