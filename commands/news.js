const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");

class News extends Command {
  constructor (client) {
    super(client, {
      name: "news",
      description: "Shows growtopia news for that day.",
      category: "Tools",
      usage: "",
      enabled: true,
      guildOnly: true,
      aliases: [],
      permLevel: "User",
      cooldown: 5,
      args: false
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
      let embed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor("GREEN")
        .setTimestamp();
    
      for (var i = 0; i < this.client.newsBuffer.length; i++) {
        embed.addField(this.client.newsBuffer[i].title, this.client.newsBuffer[i].description);
      }

      reply(embed);
    }
  }

module.exports = News;
