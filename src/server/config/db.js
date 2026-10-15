const mysql = require('mysql2/promise');
require('dotenv').config();

// High-performance MySQL connection pool optimized for 10,000+ requests
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'orbit_website',
  waitForConnections: true,
  connectionLimit: 50, // Scaled for high concurrent loads
  queueLimit: 1000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
  connectTimeout: 10000,
});

// Helper function to test DB connection on startup
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL Database connected successfully with high-concurrency pool (Limit: 50).');
    connection.release();
    return true;
  } catch (err) {
    console.warn('⚠️  MySQL Connection Note:', err.message, '— Automatic file-based CMS fallback active.');
    return false;
  }
}

module.exports = {
  pool,
  testConnection,
  query: (sql, params) => pool.execute(sql, params),
};
