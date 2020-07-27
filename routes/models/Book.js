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
// We are exporting 2 things under User first thing is the model name which is user and the UserSchema the thigns we created above
