const connectToDatabase = require("../../db");
const { UserNotFound } = require("../../exceptions");
const { decodeJWT } = require("../../utils/jwt");

async function getUser(token) {
  let connection;
  try {
    connection = connectToDatabase();
    
    const id_user = decodeJWT(token).id;
    const user = await connection.query('SELECT * FROM users WHERE id=?', id_user);
    if (!user) {
      throw new UserNotFound('User not found');
    }    
    return user;
  } catch(err) {
    console.log(err);
  } finally {
    if (connection) {
      connection.end()
    }
  }
}

module.exports = {
  getUser
}