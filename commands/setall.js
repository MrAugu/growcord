const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");
const Settings = require("../models/settings.js");

class SetAll extends Command {
  constructor (client) {
    super(client, {
      name: "setall",
      description: "Set all of the webhooks to be sent into a specific channel",
      category: "Settings",
      usage: "[channel]",
      enabled: true,
      guildOnly: true,
      aliases: [],
      permLevel: "Administrator",
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

      settings.tweetChannel = channel.id;
      settings.wotdChannel = channel.id;
      settings.forumNewsChannel = channel.id;
      settings.serverStatusChannel = channel.id;
      settings.votwChannel = channel.id;
      settings.gameNewsChannel = channel.id;
      settings.dailyQuestChannel = channel.id;
      await settings.save().catch(e => this.client.logger.log(e, "error"));
      reply(`<:greenTick:588667398593183754> All updates will now be sent in ${channel}.`);
    });
  }
}

module.exports = SetAll;
