const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  url: {
    required: true,
    lowercase: true,
    type: String,
  },
  slug: {
    required: true,
    type: String,
    unique: true,
  },
});

module.exports = mongoose.model("url", schema);
