const express = require('express');
const {
    placeOrder,
    getUserOrders
} = require('../controllers/orderController');

const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

router.post('/place', authMiddleware, placeOrder);
router.get('/', authMiddleware, getUserOrders);

module.exports = router;