const Review = require("../models/Review");
const Product = require("../models/Product");

exports.addReview = async (req, res) => {
  const { productId, rating, comment } = req.body;

  try {
    // Prevent duplicate review
    const existing = await Review.findOne({
      user: req.user.id,
      product: productId
    });

    if (existing) {
      return res.status(400).json({ msg: "You already reviewed this product" });
    }

    const review = await Review.create({
      user: req.user.id,
      product: productId,
      rating,
      comment
    });

    // Recalculate average rating
    const reviews = await Review.find({ product: productId });

    const avg =
      reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

    await Product.findByIdAndUpdate(productId, {
      rating: avg,
      numReviews: reviews.length
    });

    res.json(review);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      product: req.params.id
    }).populate("user", "name");

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};