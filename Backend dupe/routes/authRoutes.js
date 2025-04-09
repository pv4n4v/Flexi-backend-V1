const express = require('express');
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

// ✅ Middleware to Verify Token (For Protected Routes)
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token.split(' ')[1], 'your_jwt_secret');
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};

// ✅ Register API with extra fields
router.post('/register', async (req, res) => {
    const { name, email, password, confirmPassword, phone, address, gender, dob } = req.body;

    // 📩 Log incoming data
    console.log("📩 Incoming Register Request:", req.body);

    // ✅ Check for required fields
    if (!name || !email || !password || !confirmPassword || !phone || !address || !gender || !dob) {
        return res.status(400).json({ error: "All fields are required." });
    }

    // ✅ Check if passwords match
    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match." });
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log("🔎 Registering user:", { name, email, phone, address, gender, dob });

        // Insert user into database (✅ Now includes phone)
        const [result] = await db.execute(
            `INSERT INTO users (name, email, password, phone, address, gender, dob) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [name, email, hashedPassword, phone, address, gender, dob]
        );

        res.status(201).json({
            message: 'User registered successfully',
            user: { id: result.insertId, name, email }
        });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Email is already in use. Please log in instead.' });
        }
        res.status(500).json({ error: err.message });
    }
});

// ✅ Login API
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Both email and password are required." });
    }

    try {
        const [users] = await db.execute(`SELECT * FROM users WHERE email = ?`, [email]);
        if (users.length === 0) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const user = users[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Protected Route Example
router.get('/protected', verifyToken, (req, res) => {
    res.status(200).json({ message: "Welcome to the protected route!", user: req.user });
});

// ✅ Get User Profile
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const [users] = await db.execute(`SELECT id, name, email, created_at FROM users WHERE id = ?`, [req.user.id]);

        if (users.length === 0) {
            return res.status(404).json({ error: "User not found." });
        }

        res.status(200).json({ user: users[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
