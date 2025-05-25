const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    priceInPoints: { type: Number, required: true },
    image: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    available: { type: Boolean, default: true },
    category: { type: String},
    countInStock: {type: Number,required: true},
    rating: { type: Number, default: 0},
    numReviews: { type: Number, default: 0},
    tags: {type: [String], default: []},
}, { timestamps: true });

module.exports = mongoose.model('TpProduct', productSchema);
