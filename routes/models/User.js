const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  customid: {
    type: Number,
    required: true,
  },
  currentbook: [
    {
      name: {
        type: String,
        required: true,
      },
    },
  ],
  oldbook: [
    {
      name: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = User = mongoose.model("user", UserSchema);
