const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");
const Settings = require("../models/settings.js");

class Prefix extends Command {
  constructor (client) {
    super(client, {
      name: "prefix",
      description: "Set the bot prefix!",
      category: "Settings",
      usage: "<prefix>",
      enabled: true,
      guildOnly: true,
      aliases: [],
      permLevel: "Moderator",
      cooldown: 5,
      args: true
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    Settings.findOne({
      guildID: message.guild.id
    }, async (err, settings) => {
      if (err) this.client.logger.log(err, "error");
      let prefix = args[0];
      if (args[1] && args[1] === "true") prefix = `${prefix} `;
      settings.prefix = prefix;
      await settings.save().catch(e => this.client.logger.log(e, "error"));
      reply(`<:greenTick:588667398593183754> Prefix has been set to \`${prefix}\`.`);
    });
  }
}

module.exports = Prefix;
