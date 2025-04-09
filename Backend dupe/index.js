const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const db = require('./db'); // Ensure database connection is correct

// Initialize Express App
const app = express();

// Middleware
app.use(cors());
app.use(express.json());  // ✅ Required for JSON parsing
app.use(morgan('dev'));


// Import Routes
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');  // ✅ Ensure this file exists in /routes

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);  // ✅ Ensure this is present

// Root Route (for testing if server is running)
app.get('/', (req, res) => {
    res.send('Welcome to the Flexi API!');
});

// Start Server
const PORT = process.env.PORT || 5000;
console.log('✅ Registered Routes:', app._router.stack);
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
