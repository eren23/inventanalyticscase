const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

const connectDB = async () => {
  try {
    //this is async since this is async we should put await in front of connect method
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    //those json objects above for the depreciated versions
    console.log("Mongo DB Connected");
  } catch (err) {
    //if error occurs show it and crash the app
    console.error(err.message);
    //we exit project with failure
    process.exit(1);
  }
};

module.exports = connectDB;
