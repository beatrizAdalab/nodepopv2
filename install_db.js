"use strict";
require('dotenv').config();

const readLine = require("readline");
const db = require("./lib/connectMongoose");

// Models
const Item = require("./models/Item");
const User = require("./models/User")

db.once("open", async function () {
  try {
    const answer = await askUser("Are you sure you want to empty DB? (no, yes) ");
    if (answer.toLowerCase() === "yes") {

      await initItems();
      await initUsers();

    } else {
      console.log("DB install aborted!");
    }
    return process.exit(0);

  } catch (err) {
    console.log("Error!", err);
    return process.exit(1);
  }
});

function askUser(question) {
  return new Promise((resolve, reject) => {
    const rl = readLine.createInterface({
      input: process.stdin, output: process.stdout
    });
    rl.question(question, answer => {
      rl.close();
      resolve(answer);
    });
  });
}

async function initItems() {

  await Item.remove({});
  console.log("Items deleted");

  const file = "./items.json";

  console.log("Loading" + file + "...");
  const numLoaded = await Item.uploadJson(file);
  console.log(` ${numLoaded} items habe been loaded.`);

  return numLoaded;
}

async function initUsers() {
  console.log('Deleted users...');
  await User.deleteMany();
  console.log('Creating users...');
  await User.insertMany([
    {
      email: 'user@example.com​',
      password: await User.hashPassword('1234'),
      name: 'Leon'
    }
  ]);
}
