const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  content: { type: String },
  timestamp: { type: Number },
  date: { type: Date }
});

module.exports = mongoose.model("tweets", userSchema);
