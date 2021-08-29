const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");

class Tweets extends Command {
  constructor (client) {
    super(client, {
      name: "tweets",
      description: "Send last 2 tweets.",
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
        .setColor("BLUE")
        .setTimestamp();
      const ts = this.client.tweetStore;

      embed.addField("<:twitter:658009982217879563> Tweet #1 (Latest Tweet):", ts[ts.length - 1].replaceAll("<br>", "\n").replaceAll("&amp;", "&"));
      embed.addField("<:twitter:658009982217879563> Tweet #2:", ts[ts.length - 2].replaceAll("<br>", "\n").replaceAll("&amp;", "&"))

      reply(embed);
    }
  }

module.exports = Tweets;
