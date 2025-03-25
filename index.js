/*const express = require('express');
const db = require('./db');
require('dotenv').config();

const { router: authRoutes } = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));*/


const express = require('express');
const cors = require('cors');
const app = express();

const jobRoutes = require('./routes/jobRoutes');

app.use(cors());
app.use(express.json());

app.use('/api/jobs', jobRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

