const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  timestamp: { type: Number },
  date: { type: Date },
  amount: { type: Number },
  arrowType: { type: Boolean },
  delta: { type: Number }
});

module.exports = mongoose.model("onlineUserss", userSchema);
