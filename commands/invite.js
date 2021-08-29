const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");

class Invite extends Command {
  constructor (client) {
    super(client, {
      name: "invite",
      description: "Get GrowCord's invitation link.",
      category: "General",
      usage: "",
      enabled: true,
      guildOnly: false,
      aliases: [],
      permLevel: "User",
      cooldown: 5,
      args: false
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    const inviteEmbed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setDescription(`**Invite Link**: https://discord.com/api/oauth2/authorize?client_id=678010821238063105&permissions=8&scope=bot%20applications.commands\n - Why Administrator? Because the bot should view the channels in which it should automatically post without any other hassle.\n**Support Server Link**: https://discord.gg/A7JCweZ`)
      .setColor("GREEN")
      .setTimestamp();
    message.channel.send(inviteEmbed);
  }
}

module.exports = Invite;
