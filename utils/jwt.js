require('dotenv');
const jwt = require('jsonwebtoken');

function createJWT(user) {
  try {
    const secret = process.env.SECRET;
    const token = jwt.sign({ id: user.id }, secret, {
      expiresIn: '2d',
    });

    return token;
  } catch (err) {
    console.error(err);
    return err;
  }
}

module.exports = {
  createJWT,
};
