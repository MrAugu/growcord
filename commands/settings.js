const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");

class Settings extends Command {
  constructor (client) {
    super(client, {
      name: "settings",
      description: "Shows you current settings for your server.",
      category: "Settings",
      usage: "",
      enabled: true,
      guildOnly: true,
      aliases: [],
      permLevel: "Moderator",
      cooldown: 5,
      args: false
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    const s = message.guild.settings;

    const embed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setTitle(`Setting for ${message.guild.name}`)
      .addField("Prefix:", `\`${s.prefix}\``)
      .addField("Webhooks:", `- Tweet Channel: ${s.tweetChannel === "" ? "Not Set" : `<#${s.tweetChannel}>`}\n- WOTD Channel: ${s.wotdChannel === "" ? "Not Set" : `<#${s.wotdChannel}>`}\n- Server Status Channel: ${s.serverStatusChannel === "" ? "Not Set" : `<#${s.serverStatusChannel}>`}\n- Forum News Channel: ${s.forumNewsChannel === "" ? "Not Set" : `<#${s.forumNewsChannel}>`}\n- VOTW Channel: ${s.votwChannel === "" ? "Not Set" : `<#${s.votwChannel}>`}\n- Game News Channel: ${s.gameNewsChannel === "" ? "Not Set" : `<#${s.gameNewsChannel}>`}\n- Daily Quest Channel: ${s.dailyQuestChannel === "" ? "Not Set" : `<#${s.dailyQuestChannel}>`}`)
      .addField("Mentions:", `${!s.mentions || s.mentions.length < 1 ? "No mentions have been set for this server." : s.mentions.map(o => `${o.type.toProperCase()}: <@&${o.role}>`).join("\n")}`)
      .setColor("GREEN")
      .setTimestamp();
    reply(embed);
  }
}

module.exports = Settings;
