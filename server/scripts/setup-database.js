const { pool } = require('../config/database');

const createTables = async () => {
  try {
    const connection = await pool.getConnection();
    
    await connection.execute('DROP TABLE IF EXISTS canvas_notes');
    
    // Create simplified canvas_notes table
    await connection.execute(`
      CREATE TABLE canvas_notes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        contact_name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        notes TEXT,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('Database tables created successfully!');
    console.log('Ready for field note-taking!');
    connection.release();
    
  } catch (error) {
    console.error('Error creating tables:', error);
  }
};

// Run the setup if this file is executed directly
if (require.main === module) {
  createTables().then(() => {
    process.exit(0);
  });
}

module.exports = { createTables }; 