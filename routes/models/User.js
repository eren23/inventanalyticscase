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
    // experience is an array of other fields
    {
      name: {
        type: String,
        required: true,
      },
    },
  ],
  oldbook: [
    // education is an array of other fields
    {
      name: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = User = mongoose.model("user", UserSchema);
// We are exporting 2 things under User first thing is the model name which is user and the UserSchema the thigns we created above
