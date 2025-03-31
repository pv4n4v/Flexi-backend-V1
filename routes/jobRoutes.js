const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/verifyToken');

// ✅ GET all open jobs
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

// ✅ POST new job
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

// ✅ POST /api/jobs/apply — apply using job title
router.post('/apply', verifyToken, async (req, res) => {
    const db = require('../db');
    const userId = req.user.id;
    const { jobTitle } = req.body;

    try {
        // Find job by title
        const [jobs] = await db.execute(
            'SELECT id FROM jobs WHERE title = ? AND status = "open" LIMIT 1',
            [jobTitle]
        );

        if (jobs.length === 0) {
            return res.status(404).json({ error: 'Job not found or already closed.' });
        }

        const jobId = jobs[0].id;

        // Prevent duplicate application
        const [existing] = await db.execute(
            'SELECT * FROM applications WHERE user_id = ? AND job_id = ?',
            [userId, jobId]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'You have already applied to this job.' });
        }

        // Apply to the job
        await db.execute(
            'INSERT INTO applications (user_id, job_id) VALUES (?, ?)',
            [userId, jobId]
        );

        // Optionally update job status
        await db.execute(
            'UPDATE jobs SET status = "closed" WHERE id = ?',
            [jobId]
        );

        res.status(200).json({ message: 'Your job application has been sent successfully' });
    } catch (error) {
        console.error('❌ Error applying to job:', error);
        res.status(500).json({ error: 'Server error while applying to job' });
    }
});


// ✅ Get all jobs accepted by the logged-in user
router.get('/accepted', verifyToken, async (req, res) => {
    const userId = req.user.id;

    try {
        const [acceptedJobs] = await db.execute(`
            SELECT jobs.*
            FROM jobs
            JOIN applications ON jobs.id = applications.job_id
            WHERE applications.user_id = ? AND applications.is_accepted = true
        `, [userId]);

        res.status(200).json(acceptedJobs);
    } catch (error) {
        console.error('Error fetching accepted jobs:', error);
        res.status(500).json({ error: 'Failed to fetch accepted jobs' });
    }
});


module.exports = router;
