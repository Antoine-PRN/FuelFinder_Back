const bcrypt = require('bcrypt');
const connectToDatabase = require('../../db');
const { UserNotFound, InvalidPassword } = require('../../exceptions');
const { checkInput } = require('../../controls');
const { createJWT, createRefreshToken } = require('../../utils/jwt');

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
      throw new InvalidPassword('Invalid password');
    }

    // Create a JWT
    const token = createJWT(user[0].id);
    let refresh_token = null;
    const premium = user[0].premium

    // Create a Refresh Token for the user
    refresh_token = createRefreshToken(user[0]);

    // Store the Refresh Token in the 'refresh_tokens' table
    const expiresInDays = 30;
    const createdAt = new Date(); // Date de création actuelle
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + expiresInDays);
    await connection.query(
      'INSERT INTO refresh_tokens (user_id, token, created_at, expires_in) VALUES (?, ?, ?, ?)',
      [user[0].id, refresh_token, createdAt, expirationDate]
    );


    return { token, refresh_token, premium };
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