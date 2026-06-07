const express = require('express');
const {
    addProduct,
    getProducts,
    getProductById
} = require('../controllers/productController');

const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', authMiddleware, adminMiddleware, addProduct);

module.exports = router;