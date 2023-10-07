const bcrypt = require('bcrypt');
const connectToDatabase = require('../../db');
const { EmailDuplicates } = require('../../exceptions');
const { checkInput, checkEmail } = require('../../controls');
const { createJWT } = require('../../utils/jwt');

async function registerUser(password, email, firstname, lastname) {
  let connection;

  try {
    connection = connectToDatabase();
    checkInput(firstname);
    checkInput(lastname);
    checkEmail(email);

    // Check if the user already exists
    const existingUser = await connection.query('SELECT * FROM users WHERE email = ?', [email]);

    if (existingUser.length > 0) {
      throw new EmailDuplicates('User already exists');
    }

    // Hash the password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const date = new Date().toLocaleDateString('fr');

    // Insert the user into the database
    await connection.query('INSERT INTO users (email, firstname, lastname, password, account_creation) VALUES (?, ?, ?, ?, ?)', [email, firstname, lastname, hashedPassword, date]);

    return { email }; // Return the user data upon successful registration
  } catch (error) {
    throw error; // Re-throw the error for handling in the route
  } finally {
    if (connection) {
      connection.end();
    }
  }
}

async function registerGoogleUser(user) {
  let connection
  try {
    connection = connectToDatabase();

    const existingUser = await connection.query('SELECT * FROM users WHERE email = ?', [user.email]);
    if (existingUser.length > 0) {
      throw new EmailDuplicates('User already exists');
    }

    const date = new Date().toLocaleDateString('fr');
    // Insert user's data
    const result = await connection.query('INSERT INTO users (email, firstname, lastname, account_creation) VALUES (?, ?, ?, ?)', [user.email, user.given_name, user.family_name, date]);
    const token = createJWT(Number(result.insertId))
    return { token }
  } catch (error) {
    throw error;
  } finally {
    if (connection) {
      connection.end();
    }
  }
}

module.exports = {
  registerUser,
  registerGoogleUser
};
