const db = require('./db');

async function testConnection() {
    try {
        const [rows] = await db.query('SELECT 1');
        console.log('✅ MySQL Database Connected Successfully!');
    } catch (error) {
        console.error('❌ Database Connection Failed:', error);
    }
}

testConnection();
