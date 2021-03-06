const { version } = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");
const moment = require("moment");
const Discord = require ("discord.js");
require("moment-duration-format");

class Stats extends Command {
  constructor (client) {
    super(client, {
      name: "stats",
      description: "Get information on the bot.",
      category: "General",
      usage: "",
      enabled: true,
      guildOnly: false,
      aliases: ["botinfo", "bot"],
      permLevel: "User",
      cooldown: 5,
      args: false
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    const time = moment.duration(this.client.uptime).format(" D [days], H [hours], m [minutes], s [seconds]");
    const m = await reply("Hold on...");

    let users = 0;
    this.client.guilds.cache.map(g => users += g.memberCount);

    const embed = new Discord.MessageEmbed()
      .setTitle("Statistics")
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setColor("AQUA")
      .setDescription(`
Memory Usage: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB

Uptime: ${time}

Channel Count: ${this.client.channels.cache.size.toLocaleString()}
Server Count: ${this.client.guilds.cache.size.toLocaleString()}

Cached User Count: ${this.client.users.cache.size.toLocaleString()}
Total User Count: ${users.toLocaleString()}

Discord.Js Version: v${version}
Node.JS Version: ${process.version}

Latency: ${m.createdTimestamp - message.createdTimestamp} MS
      `)
      .setThumbnail(this.client.user.displayAvatarURL())
      .setTimestamp();
    m.edit("", embed);      
  }
}

module.exports = Stats;
