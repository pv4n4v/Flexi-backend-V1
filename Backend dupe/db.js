const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', 
    password: 'Pranav@123', // 🔴 Replace with your actual MySQL password
    database: 'flexi_app',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Convert pool to use Promises
const db = pool.promise();

// ✅ Ensure the database connection works
db.getConnection()
    .then((connection) => {
        console.log("✅ Connected to MySQL database: flexi_app");
        connection.release(); // Release the connection back to the pool
    })
    .catch((err) => {
        console.error("❌ MySQL connection error:", err.message);
    });

module.exports = db;



