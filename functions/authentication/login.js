const bcrypt = require('bcrypt');
const connectToDatabase = require('../../db');
const { UserNotFound } = require('../../exceptions');
const { checkInput } = require('../../controls');
const { createJWT } = require('../../utils/jwt');

async function loginUser(email, password) {
  let connection;

  try {
    connection = connectToDatabase();
    checkInput(email);

    // Check if the user exists
    const user = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    if (user.length === 0) {
      throw new UserNotFound('User not found');
    }

    // Check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user[0].password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Create a JWT
    const token = createJWT(user[0]);

    return {token};
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