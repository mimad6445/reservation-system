const express = require('express');
const router = express.Router();
const { createProduct, getProducts } = require('../controller/product.controller');
const auth = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const validate = require('../middlewares/validate.middleware');
const { productSchema } = require('../utils/validator');

router.post('/',auth,upload.single('image'),createProduct);
router.get('/', getProducts);

module.exports = router;