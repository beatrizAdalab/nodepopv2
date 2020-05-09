'use strict'
const cote = require('cote');
var jimp = require('jimp');
const path = require('path');

const responder = new cote.Responder({
  name: 'creator thumbnail responder'
});

const appendSuffix = (fileName, suffix) => {
  const dotExtension = fileName.lastIndexOf('.')
  return fileName.substr(0, dotExtension) + suffix + fileName.substr(dotExtension)
};

const pahtPublic = path.join(__dirname, '../public');

responder.on('createThumbnail', async (req) => {
  const pathFile = `${pahtPublic + req.image}`
  const pathTumbnails = appendSuffix(pathFile, '_thumbnail')

  jimp.read(pathFile)
    .then(image => {
      image
        .resize(100, 100)
        .write(pathTumbnails)

    }).catch(err => console.log(err))
});


