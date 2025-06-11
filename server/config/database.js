const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'canvas_app',
  port: process.env.DB_PORT || 3306,
  connectionLimit: 10,
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to MySQL database!');
    connection.release();
  } catch (error) {
    console.error('Error connecting to MySQL database:', error);
  }
};

module.exports = { pool, testConnection }; 
