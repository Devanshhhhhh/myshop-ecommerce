const Order = require('../models/Order');
const Cart = require('../models/Cart');

// ✅ Place Order
exports.placeOrder = async (req, res) => {
    const userId = req.user.id;

    try {
        const cart = await Cart.findOne({ user: userId });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ msg: "Cart is empty" });
        }

        const order = await Order.create({
            user: userId,
            items: cart.items,

            // ✅ FIX NAME
            totalPrice: cart.totalPrice,

            // ✅ ADD STATUS
            status: "Pending"
        });

        // ✅ Clear cart
        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();

        res.status(201).json(order);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// ✅ Get Orders of User
exports.getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;

        const orders = await Order.find({ user: userId })
            .populate('items.product') // ✅ important
            .sort({ createdAt: -1 });  // ✅ newest first

        res.json(orders);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};