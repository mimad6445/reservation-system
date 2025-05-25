const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerSchema } = require('../utils/validator');

exports.register = async (req, res) => {
    try {
        const validation = registerSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: validation.error.issues });
        }
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, wallet: 100, points: 0 });
        await user.save();
        return res.json({ message: 'User registered' });
    } catch (error) {
        console.log("error",error);
        return res.status(500).json({ error: 'Error registering user' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: 'Invalid password' });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        return res.json({ token });
    } catch (error) {
        console.log("error", error);
        return res.status(500).json({ error: 'Error logging in' });
    }
};

exports.getInfo = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        return res.json(user);
    } catch (error) {
        console.log("error", error);
        return res.status(500).json({ error: 'Error getting user info' });
    }
}