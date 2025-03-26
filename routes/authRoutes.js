const express = require('express');
const db = require('../db'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

const verifyToken = require('../middleware/verifyToken');

// ✅ Register API
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    // ✅ Check if all fields are provided
    if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields (name, email, password) are required." });
    }

    try {
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into the database
        const [result] = await db.execute(
            `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
            [name, email, hashedPassword]
        );

        res.status(201).json({ message: 'User registered successfully', user: { id: result.insertId, name, email } });
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

    // ✅ Check if fields are provided
    if (!email || !password) {
        return res.status(400).json({ error: "Both email and password are required." });
    }

    try {
        // Find user in database
        const [users] = await db.execute(`SELECT * FROM users WHERE email = ?`, [email]);
        if (users.length === 0) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const user = users[0];

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });


        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Protected Route (Requires JWT Token)
router.get('/protected', verifyToken, async (req, res) => {
    res.status(200).json({ message: "Welcome to the protected route!", user: req.user });
});

// ✅ Get User Profile (Requires Authentication)
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


