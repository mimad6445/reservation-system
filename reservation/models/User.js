const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  wallet: { type: Number, default: 0 },
  points: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('utilisateur', userSchema);
