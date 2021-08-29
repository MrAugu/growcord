const { raw } = require("body-parser");
const Discord = require("discord.js"); // eslint-disable-line no-unused-vars
const Settings = require("../models/settings");

module.exports = class {
  constructor (client) {
    this.client = client;
  }

  async run (interaction) {
    const user = new Discord.User(this.client, interaction.member.user);
    const guild = this.client.guilds.cache.get(interaction.guild_id);
    const member = guild.members.cache.get(user.id) || await guild.members.fetch(user.id);
    const channel = guild.channels.cache.get(interaction.channel_id);

    const guildSettings = await Settings.findOne({ guildID: guild.id });
    if (!guildSettings) {
      const newSettings = new Settings({
        guildID: message.guild.id,
        prefix: pref,
        tweetChannel: "",
        wotdChannel: "",
        forumNewsChannel: "",
        serverStatusChannel: "",
        votwChannel: "",
        gameNewsChannel: "",
        dailyQuestChannel: "",
        mentions: [],
        marketplaceChannel: ""
      });

      await newSettings.save().catch(e => this.client.logger.log(e, "error"));
      guild.settings = await Settings.findOne({ guildID: guild.id });
    } else {
      guild.settings = guildSettings;
    }

    const Interaction = {
      user,
      guild,
      member,
      channel
    };
    
    const name = interaction.data.name;
    const args = interaction.data.options ? interaction.data.options.map(arg => arg.value) : [];

    var replied = false;
    const reply = (content) => {
      if (replied) return console.log("Already replied to this interaction, request not sent.");

      const data = {};

      if (typeof content === "string") {
        data["content"] = content;
      } else if (typeof content === "object") {
        try {
            data["embeds"] = [content.toJSON()];
        } catch (e) {
          console.log("Object, non embed content?", content);
          data["content"] = ":x: An internal error has occured.";
        }
      } else {
        data["content"] = String(content);
      }

      this.client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
          type: 4,
          data
        }
      }).then(() => {
        replied = true;
      });
    };

    const cmd = this.client.slashCommands.get(name);
    if (!cmd) return reply(`<:redTick:588667371825135626> Slash command not found? Please update the slash command list for your guild using \`${guild.settings.prefix}refresh\` and try again.`);
    const level = this.client.permlevel(member, this.client);
    if (level < 9 && this.client.cmdMaintenance === true) return reply("<:redTick:588667371825135626> We are currently undergoing a maintenance we'll be back soon.");
    if (cmd.conf.enabled === false) return reply("<:redTick:588667371825135626> This command is currently globally disabled.");

    this.client.channels.cache.get("825065405172678736").send(`**/${cmd.help.name}** used by **${Interaction.user.tag}** (ID: ${Interaction.user.id}) in **${Interaction.guild.name}** (ID: ${Interaction.guild.id}).`);

    try {
      await cmd.run(Interaction, args, reply);
    } catch (e) {
      reply(":warning: An internal error occured, cannot fulfil this command. The error has been sent to the development team.");
      this.client.channels.cache.get("825065405172678736").send(`:x: **/${cmd.help.name}** used by **${Interaction.user.tag}** (ID: ${Interaction.user.id}) in **${Interaction.guild.name}** (ID: ${Interaction.guild.id}) resulted in: \`\`\`xl\n${e}\n\`\`\``);
    }
  }
};