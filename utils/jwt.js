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
  createRefreshToken,
  getRefreshToken,
};
