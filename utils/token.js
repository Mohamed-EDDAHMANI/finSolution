const jwt = require('jsonwebtoken');

function createAccessToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    picture: user.picture
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_EXPIRES || '15m'
  });
}

function createRefreshToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    picture: user.picture
  };
  return jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: process.env.REFRESH_EXPIRES || '7d' }); // long-lived
}


module.exports = { createAccessToken, createRefreshToken };
