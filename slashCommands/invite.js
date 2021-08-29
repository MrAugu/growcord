const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const SlashCommand = require("../base/SlashCommand.js");

class Invite extends SlashCommand {
  constructor (client) {
    super(client, {
      name: "invite",
      description: "Get GrowCord's invitation link.",
      category: "General",
      enabled: true,
      guildOnly: true,
      permLevel: "User",
      options: []
    });
  }

  async run (interaction, args, reply) { // eslint-disable-line no-unused-vars
    const inviteEmbed = new Discord.MessageEmbed()
      .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
      .setDescription(`**Invite Link**: https://discordapp.com/api/oauth2/authorize?client_id=678010821238063105&permissions=8&scope=bot\n - Why Administrator? Because the bot should view the channels in which it should automatically post without any other hassle.\n**Support Server Link**: https://discord.gg/A7JCweZ`)
      .setColor("GREEN")
      .setTimestamp();
    reply(inviteEmbed);
  }
}

module.exports = Invite;