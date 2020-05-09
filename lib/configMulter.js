'use strict'
const multer = require('multer');
const path = require('path');
const uuid = require('uuid/v4');

//config storage multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/images/items'))
  },
  filename: function (req, file, cb) {
    //cb(null, uuid() + path.extname(file.originalname).toLowerCase())
    cb(null, file.originalname)
  }
})

module.exports = multer({ storage: storage })