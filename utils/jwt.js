require('dotenv');
const jwt = require('jsonwebtoken');

function createJWT(id) {
  try {
    const secret = process.env.SECRET;
    const token = jwt.sign({ id: id }, secret, {
      expiresIn: '1y',
    });

    return token;
  } catch (err) {
    console.error(err);
    return err;
  }
}

function decodeJWT(token) {
  try {
    const secret = process.env.SECRET;
    const decoded = jwt.decode(token, secret);

    return decoded;
  } catch (error) {
    return error;
  }
}

function createRefreshToken(user) {
  try {
    const secret = process.env.REFRESH_SECRET;
    const refreshToken = jwt.sign({ id: user.id }, secret, {
      expiresIn: '30d',
    });
    return refreshToken;
  } catch (err) {
    console.error(err);
    return err;
  }
}

function getRefreshToken(token) {
  console.log(token)
  try {
    const secret = process.env.REFRESH_SECRET;
    const verify = jwt.verify(token, secret);
    console.log(verify);
    return verify;
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  createJWT,
  decodeJWT,
  createRefreshToken,
  getRefreshToken,
};
