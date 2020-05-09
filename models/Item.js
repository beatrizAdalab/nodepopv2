"use strict";

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Schema = mongoose.Schema;
const cote = require('cote')

const thumbnailRequester = new cote.Requester({
  name: 'thumbnail creator requester'
});

const itemSchema = Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  buy: {
    type: Boolean,
    required: true,
    index: true
  },
  price: {
    type: Number,
    index: true
  },
  photo: String,
  tags: {
    type: [String],
    index: true
  }
}, { versionKey: false });

/* file json upload */

itemSchema.statics.uploadJson = async function (file) {

  const data = await new Promise((resolve, reject) => {
    fs.readFile(file, { encoding: "utf8" }, (err, data) => {
      return err ? reject(err) : resolve(data);
    });
  });

  console.log(`${file} readed.`);

  if (!data) {
    throw new Error(`${file} is empty.`);
  }

  const items = JSON.parse(data).items;
  const numItems = items.length;

  for (var i = 0; i < items.length; i++) {
    await (new Item(items[i])).save();
  }
  return numItems;
};

/** list allowed tags */
itemSchema.statics.allowedTags = function () {
  return ["work", "lifestyle", "motor", "mobile"];
};

/**  save Photo Items*/
itemSchema.methods.setFile = async function (imageObject) {
  if (!imageObject) return
  console.log(imageObject)

  const pathPhoto = path.join('/images/items', imageObject.originalname)
  this.photo = pathPhoto

  thumbnailRequester.send({
    type: 'createThumbnail',
    image: pathPhoto
  })
}

/** find items */
itemSchema.statics.list = function (name, buy, tag, price, limit, page, sort, fields, cb) {

  try {
    //initial filter
    let filter = {};

    if (name) filter.name = { "$regex": `^${name}`, "$options": "i" };
    if (buy) filter.buy = buy === "true" ? true : false;
    if (tag) filter.tags = { $all: [tag] };

    if (price) {
      const fullPrice = price.split("-");

      if (fullPrice.length === 2) {
        if (fullPrice[0] === "") {
          filter.price = { $lte: fullPrice[1] };
        } else if (
          fullPrice[1] === "") {
          filter.price = { $gte: fullPrice[0] };
        } else {
          filter.price = { $lte: fullPrice[1], $gte: fullPrice[0] };
        }
      } else {
        filter.price = price;
      }
    };

    const query = Item.find(filter)
      .collation({ locale: "en", strength: 2 }); //Sorting MongoDB Case Insensitive

    let perPage = limit ? parseInt(limit) : 5;
    let pg = page ? parseInt(page) : 1;

    query.limit(perPage);
    query.skip((perPage * pg) - perPage);
    query.select(fields);

    if (sort) {
      const userSort = {};
      userSort[sort] = 1; // ascending
      query.sort(userSort);

    } else {
      query.sort({ name: 1 });
    }
    return query.exec();

  } catch (err) {
    next(err);
  };
};

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;