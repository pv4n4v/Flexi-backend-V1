/*const express = require('express');
const router = express.Router();
const jobModel = require('../models/job');
const { verifyToken } = require('./authRoutes'); // imported from authRoutes

// 🟢 POST /api/jobs — Create Job (Protected)
router.post('/', verifyToken, async (req, res) => {
    const { title, description, location, wage, status } = req.body;

    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
    }

    try {
        console.log('🟢 Creating job with:', title, description, location, wage, status, req.user.id);
        await jobModel.createJob(title, description, location, wage, status, req.user.id);
        res.status(201).json({ message: 'Job created successfully' });
    } catch (error) {
        console.error('❌ Error in job POST route:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router; */


const express = require('express');
const router = express.Router();
const db = require('../db'); // assuming you're using raw mysql2

router.get('/', async (req, res) => {
    try {
        const [jobs] = await db.execute(
            "SELECT id, title, description, wage, location, created_at, status FROM jobs WHERE status = 'open'"
        );
        res.json(jobs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching jobs' });
    }
});

module.exports = router;


