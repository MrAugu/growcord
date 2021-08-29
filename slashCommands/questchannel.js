const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const SlashCommand = require("../base/SlashCommand.js");
const Settings = require("../models/settings");

class QuestChannel extends SlashCommand {
  constructor (client) {
    super(client, {
      name: "questchannel",
      description: "Set the daily quest updates channel for your server.",
      enabled: true,
      guildOnly: true,
      permLevel: "Moderator",
      category: "Settings",
      options: [{
        type: 7,
        name: "channel",
        description: "The channel you want daily quests to be sent in.",
        required: false
      }]
    });
  }

  async run (interaction, args, reply) { // eslint-disable-line no-unused-vars
    const channel = interaction.guild.channels.cache.get(args[0]) || interaction.channel;
    if (channel.type !== "text") return reply(`<:redTick:588667371825135626> You need to select a text channel.`);
    if (!channel) return reply("Internal error occured.");

    Settings.findOne({
      guildID: interaction.guild.id
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