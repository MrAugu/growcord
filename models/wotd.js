const mongoose = require("mongoose");

const wotdSchema = mongoose.Schema({
  name: { type: String },
  date: { type: Date },
  timestamp: { type: Number }
});

module.exports = mongoose.model("wotds", wotdSchema);