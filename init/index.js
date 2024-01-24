//this file is for initializing the sample data in the DB


const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");


async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

main().catch((err) => console.log(err));
main().then(() => {
  console.log("connected to DB");
});

const initDB = async () => {
  await Listing.deleteMany({})
  initData.data = initData.data.map((obj)=>({...obj, owner:'65a5f384e225cde7f35fb9eb'}))
  await Listing.insertMany(initData.data);
  console.log("data is initialized");
};

initDB();

