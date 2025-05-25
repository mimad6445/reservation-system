const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const redis = require('redis');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const reservationRoutes = require('./routes/reservation.routes');
const Connectdb = require('./config/db')
dotenv.config();
const app = express();
const path = require("node:path")

Connectdb();
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res, path) => {
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    }
}));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reservations', reservationRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));