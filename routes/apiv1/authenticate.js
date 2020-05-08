'use strict'
require('dotenv').config();

const express = require('express');
const User = require('../../models/User');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


// POST authenticate user
router.post('/', async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(422).json({ ok: false, error: 'the email or password are not valid' })

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(422).json({ ok: false, error: 'the email or password are not valid' })

    //new Token 
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '2d'
    });

    // send token
    res.status(201).json({ token: jwtToken });

  } catch (err) {
    next(err)
  }
});

module.exports = router