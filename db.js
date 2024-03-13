const mariadb = require('mariadb');
require('dotenv').config();

function connectToDatabase() {
  try {
    const connection = mariadb.createPool({
      host: process.env.MARIADB_HOST,
      port: process.env.MARIADB_DB_PORT,
      user: process.env.MARIADB_USER,
      password: process.env.MARIADB_PASSWORD,
      database: process.env.MARIADB_DATABASE,
      connectionLimit: 5,
    });

    return connection;
  } catch (error) {
    console.error('Error during database connection :', error);
    throw error;
  }
}

module.exports = connectToDatabase;