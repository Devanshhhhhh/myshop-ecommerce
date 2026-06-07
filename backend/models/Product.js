const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    stock: Number,
    category: {
        type: String,
        required: true,
        enum: ["electronics", "clothing", "home"]
    },
    image: { type: String, required: true },
    rating: {
    type: Number,
    default: 0
    },
    numReviews: {
    type: Number,
    default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);