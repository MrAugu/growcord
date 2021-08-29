const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");
const Settings = require("../models/settings.js");

class QuestChannel extends Command {
  constructor (client) {
    super(client, {
      name: "questchannel",
      description: "Set the daily quest updates channel for your server.",
      category: "Settings",
      usage: "[channel]",
      enabled: true,
      guildOnly: true,
      aliases: [],
      permLevel: "Moderator",
      cooldown: 5,
      args: false
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    const channel = message.mentions.channels.first() || message.channel;
    if (!channel) return reply("Internal error occured.");

    Settings.findOne({
      guildID: message.guild.id
    }, async (err, settings) => {
      if (err) this.client.logger.log(err, "error");

      settings.dailyQuestChannel = channel.id;
      if (args[0] && args[0] === "reset") settings.dailyQuestChannel = "";
      await settings.save().catch(e => this.client.logger.log(e, "error"));
      reply(`<:greenTick:588667398593183754> Daily Quest updates ${args[0] && args[0] === "reset" ? `channel has been reset.` : `will now be sent in ${channel}.`}`);
    });
  }
}

module.exports = QuestChannel;
