const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Add to Cart

exports.addToCart = async (req, res) => {

    const userId = req.user.id;
    const { productId, quantity } = req.body;

    try {
        let cart = await Cart.findOne({ user: userId });

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ msg: "Product not found" });

        if (!cart) {
            cart = new Cart({ user: userId, items: [], totalPrice: 0 });
        }

        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        let total = 0;
        for (let item of cart.items) {
            const prod = await Product.findById(item.product);
            total += prod.price * item.quantity;
        }

        cart.totalPrice = total;

        await cart.save();
        res.json(cart);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Cart
exports.getCart = async (req, res) => {
    const userId = req.user.id;

    try {
        const cart = await Cart.findOne({ user: userId }).populate('items.product');
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Remove Item
exports.removeFromCart = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.body;

  try {
    let cart = await Cart.findOne({ user: userId });

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // 👉 If quantity > 1 → decrease
      if (cart.items[itemIndex].quantity > 1) {
        cart.items[itemIndex].quantity -= 1;
      } 
      // 👉 If quantity = 1 → remove item
      else {
        cart.items.splice(itemIndex, 1);
      }
    }

    // 🔄 Recalculate total
    let total = 0;
    for (let item of cart.items) {
      const product = await Product.findById(item.product);
      total += product.price * item.quantity;
    }

    cart.totalPrice = total;

    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};