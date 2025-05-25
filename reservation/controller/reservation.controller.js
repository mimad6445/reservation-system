const Reservation = require('../models/Reservation');
const Product = require('../models/Product');
const User = require('../models/User');

exports.createReservation = async (req, res) => {
    try {
        const { productId, startdate, enddate , userId } = req.body;
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        if (!product.available) return res.status(400).json({ error: 'Product not available' });
        
        const user = await User.findById(userId);
        console.log("user", user);
        if (user.points < product.priceInPoints) {
            return res.status(400).json({ error: 'Not enough points' });
        }
        user.points -= product.priceInPoints;
        await user.save();
        const reservation = new Reservation({ user: userId, product: productId, startdate, enddate, status: 'confirmed' });
        await reservation.save();
        if(product.countInStock >= 0){
            product.countInStock -= 1;
            await product.save();
        }else{
            product.available = false;
            await product.save();
        }
        res.status(201).json({ message: 'Reservation confirmed', reservation });
    } catch (error) {
        console.log("error", error);
        return res.status(500).json({ error: 'Error creating reservation' });
    }
};


exports.cancelReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const reservation = await Reservation.findById(id).populate('product user');
        if (!reservation) return res.status(404).json({ error: 'Reservation not found' });
        const now = new Date();
        if (new Date(reservation.enddate) > now) {
            console.log("reservation.date", reservation.enddate);
            console.log("now", now);
            reservation.user.points += reservation.product.priceInPoints;
            await reservation.user.save();
        }
        console.log("reservation.product", reservation.product);
        reservation.product.available = true;
        reservation.product.countInStock ++;
        reservation.status = 'cancelled';
        await reservation.save();
        await reservation.product.save();
        
        res.json({ message: 'Reservation cancelled' });
    } catch (error) {
        console.error('Error cancelling reservation:', error);
        res.status(500).json({ error: 'Error cancelling reservation' });
    }
};

exports.completeReservation = async (req, res) => {
    const { id } = req.params;
    const reservation = await Reservation.findById(id).populate('product');
    if (!reservation) return res.status(404).json({ error: 'Reservation not found' });
    reservation.status = 'finished';
    await reservation.save();
    reservation.product.available = true;
    await reservation.product.save();
    res.json({ message: 'Reservation completed' });
};

exports.getMyReservations = async (req, res) => {
    try {
        const userId = req.body.userId;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const reservations = await Reservation.find({ user: userId })
            .populate('product')
            .sort({ createdAt: -1 }); // Changed from date to createdAt since date field doesn't exist

        res.json(reservations);
    } catch (error) {
        console.error('Error fetching reservations:', error);
        res.status(500).json({ error: 'Error fetching reservations' });
    }
};