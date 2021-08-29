const mongoose = require("mongoose");

const questSchema = mongoose.Schema({
  date: { type: Date },
  dayIdentifier: { type: String },
  buffer: { type: Array, default: [] }
});

module.exports = mongoose.model("buffers", questSchema);