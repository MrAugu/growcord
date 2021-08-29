const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const SlashCommand = require("../base/SlashCommand.js");
const Settings = require("../models/settings");

class Prefix extends SlashCommand {
  constructor (client) {
    super(client, {
      name: "prefix",
      description: "Set the bot prefix.",
      enabled: true,
      guildOnly: true,
      permLevel: "Moderator",
      category: "Settings",
      options: [{
        type: 3,
        name: "prefix",
        description: "The prefix you want to use for the bot outside the slash.",
        required: true
      }, {
        type: 3,
        name: "space-before",
        description: "Wheter to include space in the prefix or not.",
        required: false,
        choices: [{ name: "yes", value: "yes" }, { name: "no", value: "no"}]
      }]
    });
  }

  async run (interaction, args, reply) { // eslint-disable-line no-unused-vars
    console.log(args);
    Settings.findOne({
        guildID: interaction.guild.id
      }, async (err, settings) => {
        if (err) this.client.logger.log(err, "error");
        let prefix = args[0];
        if (args[1] && args[1] === "yes") prefix = `${prefix} `;
        settings.prefix = prefix;
        await settings.save().catch(e => this.client.logger.log(e, "error"));
        reply(`<:greenTick:588667398593183754> Prefix has been set to \`${prefix}\`.`);
      });
  }
}

module.exports = Prefix;