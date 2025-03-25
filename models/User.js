const db = require('../db'); // Import database connection

class User {
    static async create(name, email, password) {
        const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
        try {
            const [result] = await db.execute(query, [name, email, password]); // Use .execute() correctly
            
            if (result && result.insertId) { // Ensure insertId exists
                return { id: result.insertId, name, email };
            } else {
                throw new Error('User creation failed, insertId missing.');
            }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = User;




