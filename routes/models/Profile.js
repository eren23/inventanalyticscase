const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, //it connects with an Id in user model, the id that mongo creates in id field on cloud
    ref: "user", // this is a reference for model we are talking about
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

module.exports = Profile = mongoose.model("profile", ProfileSchema);
