"user strict";

const Item = require("../../models/Item");
const upload = require('../../lib/configMulter');
const { validationResult } = require("express-validator");

const itemCtrl = {};

itemCtrl.GetItems = async (req, res, next) => {
  try {
    validationResult(req).throw();

    const { name, buy, tag, price, limit, page, sort, fields } = req.query;

    const docs = await Item.list(name, buy, tag, price, limit, page, sort, fields);

    typeof docs !== "undefined" && docs.length > 0 ?
      res.json({ count: docs.length, page: parseInt(page) ? page : "1", results: docs }) :
      res.json({ count: docs.length, result: "There is no item that matches your search" });

  } catch (err) {
    next(err);
  }
};

itemCtrl.createItem = (req, res, next) => {
  const name = req.body.name
  res.send(console.log(name, 'sksksk'))
}

/* itemCtrl.createItem = async (req, res, next) => {
  console.log(req.body)
  try {

    //validation
    validationResult(req).throw();

    //new item
    const newItem = (req.body);
    const item = new Item(newItem);

    //console.log(req.file, 'file')

    //save item
    const itemSaved = await item.save();

    res.status(201).json({
      success: true,
      result: itemSaved
    });

  } catch (err) {
    next(err);
  }
}; */

itemCtrl.GetTags = async (req, res, next) => {
  try {
    const tags = await Item.allowedTags();
    res.json({ tags: tags });

  } catch (err) {
    next(err);
  }
};

itemCtrl.IndexApi = async (req, res, next) => {
  try {
    res.json({ "Nodeapi Index": { login: "apiv1/login", tags: "/apiv1/tags", items: "/apiv1/items" } });

  } catch (err) {
    next(err);
  }
};

module.exports = itemCtrl;