const express = require("express");
const router = express.Router();

const {
  addReview,
  getReviews
} = require("../controllers/reviewController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, addReview);
router.get("/:id", getReviews);

module.exports = router;