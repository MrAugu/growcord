const mongoose = require("mongoose");

const wotdSchema = mongoose.Schema({
  id: { type: String },
  date: { type: Date },
  timestamp: { type: Number },
  meta: { type: Object }
});

module.exports = mongoose.model("votws", wotdSchema);