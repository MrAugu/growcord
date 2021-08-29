const mongoose = require("mongoose");

const questSchema = mongoose.Schema({
  date: { type: Date },
  timestamp: { type: Number },
  first_item: { type: Object },
  second_item: { type: Object }
});

module.exports = mongoose.model("quests", questSchema);