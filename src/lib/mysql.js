// src/lib/mysql.js
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'dealsDB',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

if (!process.env.MYSQL_HOST && !process.env.MYSQL_USER) {
  console.warn('MySQL environment variables not set. Using defaults.');
}

// Create connection pool
let pool;

if (process.env.NODE_ENV === 'development') {
  if (!global._mysqlPool) {
    global._mysqlPool = mysql.createPool(dbConfig);
  }
  pool = global._mysqlPool;
} else {
  pool = mysql.createPool(dbConfig);
}

// Helper function to get connection from pool
export async function getConnection() {
  return await pool.getConnection();
}

// Helper function to execute queries
export async function query(sql, params) {
  const [results] = await pool.execute(sql, params);
  return results;
}

// Export pool for direct access if needed
export default pool;
