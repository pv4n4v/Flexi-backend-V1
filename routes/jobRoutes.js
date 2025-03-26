const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/verifyToken');

// ✅ GET /api/jobs — public route
router.get('/', async (req, res) => {
    try {
        const [jobs] = await db.execute(
            "SELECT id, title, description, wage, location, created_at, status FROM jobs WHERE status = 'open'"
        );
        res.status(200).json(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ message: 'Error fetching jobs' });
    }
});

// ✅ POST /api/jobs — protected route
router.post('/', verifyToken, async (req, res) => {
    const { title, description, location, wage, status } = req.body;

    if (!title || !description || !location || !wage || !status) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const employerId = req.user.id;

        await db.execute(
            'INSERT INTO jobs (title, description, location, wage, status, employer_id) VALUES (?, ?, ?, ?, ?, ?)',
            [title, description, location, wage, status, employerId]
        );

        res.status(201).json({ message: 'Job created successfully' });
    } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({ error: 'Error creating job' });
    }
});

module.exports = router;
