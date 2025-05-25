const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
    try {
        const { name , description , priceInPoints , category , countInStock , rating , numReviews , tags } = req.body;
        const image = req.file ? req.file.filename : req.body.image;
        console.log(req.file.filename);
        const newProduct = new Product({
            name,
            description,
            priceInPoints,
            image,
            user: req.userId,
            category,
            countInStock,
            rating: rating || 0,
            numReviews: numReviews || 0,
            tags: tags || []
        });
        await newProduct.save();
        res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create product' });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        console.log(products);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { name, description, priceInPoints } = req.body;
        const image = req.file ? req.file.filename : null;

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, { name, description, priceInPoints, image }, { new: true });
        
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ message: 'Product updated', product: updatedProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ message: 'Product deleted', product: deletedProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};