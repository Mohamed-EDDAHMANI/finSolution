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

module.exports = { createAccessToken };
