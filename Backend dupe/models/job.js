const db = require('../db');

// Get all jobs
const getAllJobs = () => {
    return db.execute('SELECT * FROM jobs WHERE status = "Open"');
};

// Get jobs posted by an employer
const getEmployerJobs = (employer_id) => {
    return db.execute('SELECT * FROM jobs WHERE employer_id = ?', [employer_id]);
};

// Get a single job by ID
const getJobById = (id) => {
    return db.execute('SELECT * FROM jobs WHERE id = ?', [id]);
};

// Create a new job
const createJob = (title, description, location, salary, status, employer_id) => {
    return db.execute(
        'INSERT INTO jobs (title, description, location, salary, status, employer_id) VALUES (?, ?, ?, ?, ?, ?)',
        [title, description, location, salary, status, employer_id]
    );
};

// Update a job
const updateJob = (id, title, description, location, salary, status) => {
    return db.execute(
        'UPDATE jobs SET title=?, description=?, location=?, salary=?, status=? WHERE id=?',
        [title, description, location, salary, status, id]
    );
};

// Delete a job
const deleteJob = (id) => {
    return db.execute('DELETE FROM jobs WHERE id = ?', [id]);
};

// Apply for a job
const applyForJob = (job_id, employee_id) => {
    return db.execute(
        'INSERT INTO applications (job_id, employee_id) VALUES (?, ?)',
        [job_id, employee_id]
    );
};

// ✅ Correctly export all functions
module.exports = {
    getAllJobs,
    getEmployerJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    applyForJob
};
