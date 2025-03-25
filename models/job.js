
const db = require('../db');

const createJob = (title, description, location, wage, status, employer_id) => {
    return db.execute(
        'INSERT INTO jobs (title, description, location, wage, status, employer_id) VALUES (?, ?, ?, ?, ?, ?)',
        [title, description, location, wage, status, employer_id]
    );
};

module.exports = { createJob };


