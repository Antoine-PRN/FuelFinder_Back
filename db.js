const mariadb = require('mariadb');
require('dotenv').config();

function connectToDatabase() {
  try {
    const connection = mariadb.createPool({
      host: process.env.HOST,
      port: process.env.DB_PORT,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      connectionLimit: 5,
    });

    return connection;
  } catch (error) {
    console.error('Error during database connection :', error);
    throw error;
  }
}

module.exports = connectToDatabase;