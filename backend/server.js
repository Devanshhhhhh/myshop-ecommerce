const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/payment", require("./routes/payment"));
app.use("/api/wishlist", require("./routes/wishlist"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/reviews", require("./routes/reviewRoutes"));

app.get('/', (req, res) => {
    res.send('API Running...');
});

const connectDB = require('./config/db');
connectDB();

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

const cartRoutes = require('./routes/cartRoutes');
app.use('/api/cart', cartRoutes);

const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
