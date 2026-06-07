const Product = require('../models/Product');

// Add Product
exports.addProduct = async (req, res) => {
    try {
        const product = await Product.create({
        name: req.body.name,
        price: req.body.price,
        image: req.body.image,
        category: req.body.category
        });
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get All Products
exports.getProducts = async (req, res) => {

    const { search, maxPrice, category } = req.query;

    let filter = {};

    if (search) {
    filter.name = { $regex: search, $options: "i" };
    }

    if (maxPrice) {
    filter.price = { $lte: Number(maxPrice) };
    }

    if (category) {
    filter.category = category;
    }

    try {
        const products = await Product.find(filter);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Single Product
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};