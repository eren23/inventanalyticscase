const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  review: {
    type: Number,
    default: 0,
  },
  reviewcounter: {
    type: Number,
    default: 0,
  },
  customid: {
    type: Number,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

module.exports = Book = mongoose.model("book", UserSchema);
