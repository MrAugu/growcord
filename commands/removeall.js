const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");
const Settings = require("../models/settings.js");

class RemoveAll extends Command {
  constructor (client) {
    super(client, {
      name: "removeall",
      description: "Resets all of the webhooks settings for your server.",
      category: "Settings",
      usage: "",
      enabled: true,
      guildOnly: true,
      aliases: [],
      permLevel: "Administrator",
      cooldown: 5,
      args: false
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    Settings.findOne({
      guildID: message.guild.id
    }, async (err, settings) => {
      if (err) this.client.logger.log(err, "error");

      settings.tweetChannel = "";
      settings.wotdChannel = "";
      settings.forumNewsChannel = "";
      settings.serverStatusChannel = "";
      settings.votwChannel = "";
      settings.gameNewsChannel = "";
      settings.dailyQuestChannel = "";
      await settings.save().catch(e => this.client.logger.log(e, "error"));
      reply(`<:greenTick:588667398593183754> All of the existing webhooks have been removed.`);
    });
  }
}

module.exports = RemoveAll;
