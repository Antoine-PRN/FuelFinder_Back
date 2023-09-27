const bcrypt = require('bcrypt');
const connectToDatabase = require('../../db');
const { UserNotFound } = require('../../exceptions');
const { checkInput } = require('../../controls');

async function loginUser(email, password) {
  let connection;

  try {
    connection = connectToDatabase();
    checkInput(email);

    // Check if the user exists
    const existingUser = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length === 0) {
      throw new UserNotFound('User not found');
    }

    // Check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(password, existingUser[0].password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    return {email};
  } catch (error) {
    throw error;
  }
  finally {
    if (connection) {
      connection.end();
    }
  }
}

module.exports = {
  loginUser
}