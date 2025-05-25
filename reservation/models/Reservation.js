const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'utilisateur' },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'TpProduct' },
    startdate: { type: Date, required: true },
    enddate: { type: Date, required: true },
    status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);
