const mongoose = require("mongoose");

const settingSchema = mongoose.Schema({
  guildID: String,
  prefix: String,
  tweetChannel: String,
  wotdChannel: String,
  forumNewsChannel: String,
  serverStatusChannel: String,
  votwChannel: String,
  gameNewsChannel: String,
  dailyQuestChannel: String,
  mentions: Array,
  marketplaceChannel: String
});

module.exports = mongoose.model("settings", settingSchema);
