'use strict'
require('dotenv').config();

const jwt = require('jsonwebtoken')

async function verifyToken(req, res, next) {
  const token = req.body.token || req.query.token || req.get('x-access-token')
  if (!token) {
    return res.status(401).send({ auth: false, message: 'No token provided' });
  }

  // Decode the Tokenreq.userId = decoded.id;
  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      return res.status(400).send('Token invalid')
    }

    req.userId = decoded.id;
    next()
  });
}

module.exports = verifyToken;