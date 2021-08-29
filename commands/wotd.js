const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");
const request = require("request");
const moment = require("moment-timezone");

class Wotd extends Command {
  constructor (client) {
    super(client, {
      name: "wotd",
      description: "Sends today's WOTD.",
      category: "Tools",
      usage: "bwotd",
      enabled: true,
      guildOnly: false,
      aliases: [],
      permLevel: "User",
      cooldown: 5,
      args: false
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    request("https://growtopiagame.com/detail", async (err, res, body) => {
        const json = JSON.parse(body);

        var wotd = json.world_day_images.full_size;
        wotd = wotd.split("/worlds/")[1].trim();
        wotd = wotd.split(".")[0].trim();

        const growtopiaTime = moment.tz(Date.now(), "America/New_York");

        const embed = new Discord.MessageEmbed()
          .setTitle("<:wotd:723221906660261939> World of The Day <:wotd:723221906660261939>")
          .setDescription(`Today, **${growtopiaTime.format("MMM Do YYYY")}**, the world of the day winner is **${wotd.toUpperCase()}**. Visit it today in Growtopia!`)
          .setImage(json.world_day_images.full_size)
          .setColor("GREEN");

        reply(embed);
    });
  }
}

module.exports = Wotd;
