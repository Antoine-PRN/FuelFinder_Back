const bcrypt = require('bcrypt');
const connectToDatabase = require('../../db');
const { UsernameDuplicates } = require('../../exceptions');
const { checkInput, checkEmail } = require('../../controls');

async function registerUser(username, password, email) {
  let connection;

  try {
    connection = connectToDatabase();
    checkInput(username);
    checkEmail(email);

    // Check if the user already exists
    const existingUser = await connection.query('SELECT * FROM users WHERE username = ?', [username]);

    if (existingUser.length > 0) {
      throw new UsernameDuplicates('Username already exists');
    }

    // Hash the password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the user into the database
    await connection.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);

    return { username, email }; // Return the user data upon successful registration
  } catch (error) {
    throw error; // Re-throw the error for handling in the route
  } finally {
    if (connection) {
      connection.end();
    }
  }
}

module.exports = {
  registerUser
};
