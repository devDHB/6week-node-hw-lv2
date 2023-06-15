const mongoose = require("mongoose");

const postCountSchema = new mongoose.Schema({
  postCount: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("PostCount", postCountSchema);
