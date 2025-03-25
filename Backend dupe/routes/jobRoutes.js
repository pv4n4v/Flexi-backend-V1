const express = require('express');
const router = express.Router();
const jobModel = require('../models/job');  // ✅ Ensure this is correctly imported
const { verifyToken } = require('./authRoutes');  // ✅ Ensure this is correctly imported

// ✅ Debugging Step: Log to verify routes are loaded
console.log('✅ Job Routes Loaded');

// 🟢 Get all jobs (For Employees)
router.get('/', async (req, res) => {
    try {
        const [jobs] = await jobModel.getAllJobs();
        res.json(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ error: 'Error fetching jobs' });
    }
});

// 🔵 Get jobs posted by an employer (Protected)
router.get('/employer', verifyToken, async (req, res) => {
    try {
        const [jobs] = await jobModel.getEmployerJobs(req.user.id);
        res.json(jobs);
    } catch (error) {
        console.error('Error fetching employer jobs:', error);
        res.status(500).json({ error: 'Error fetching employer jobs' });
    }
});

// 🟢 Get a single job by ID
router.get('/:id', async (req, res) => {
    try {
        const [job] = await jobModel.getJobById(req.params.id);
        if (job.length === 0) return res.status(404).json({ error: 'Job not found' });
        res.json(job[0]);
    } catch (error) {
        console.error('Error fetching job:', error);
        res.status(500).json({ error: 'Error fetching job' });
    }
});

// 🔴 Create a Job Posting (Employer Only)
router.post('/', verifyToken, async (req, res) => {
    const { title, description, location, salary, status } = req.body;
    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
    }

    try {
        await jobModel.createJob(title, description, location, salary, status, req.user.id);
        res.status(201).json({ message: 'Job created successfully' });
    } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({ error: 'Error creating job' });
    }
});

// 🟡 Update a job (Employer Only)
router.put('/:id', verifyToken, async (req, res) => {
    const { title, description, location, salary, status } = req.body;
    try {
        await jobModel.updateJob(req.params.id, title, description, location, salary, status);
        res.json({ message: 'Job updated successfully' });
    } catch (error) {
        console.error('Error updating job:', error);
        res.status(500).json({ error: 'Error updating job' });
    }
});

// 🔴 Delete a job (Employer Only)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await jobModel.deleteJob(req.params.id);
        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        console.error('Error deleting job:', error);
        res.status(500).json({ error: 'Error deleting job' });
    }
});

// 🟢 Apply for a job (Employee Only)
router.post('/:id/apply', verifyToken, async (req, res) => {
    try {
        await jobModel.applyForJob(req.params.id, req.user.id);
        res.json({ message: 'Job application submitted successfully' });
    } catch (error) {
        console.error('Error applying for job:', error);
        res.status(500).json({ error: 'Error applying for job' });
    }
});

module.exports = router;
