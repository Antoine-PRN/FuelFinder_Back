const connectToDatabase = require("../../db");


async function getToken() {
  try {
    const connection = connectToDatabase();
    const token = await connection.query('SELECT * from refresh_tokens WHERE')
  }
}