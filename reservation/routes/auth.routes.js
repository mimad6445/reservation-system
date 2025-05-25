const express = require('express');
const router = express.Router();
const { register, login , getInfo } = require('../controller/auth.controller');

router.post('/register', register);
router.post('/login', login);
router.get('/getinfo/:id', getInfo);

module.exports = router;