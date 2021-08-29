const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const SlashCommand = require("../base/SlashCommand.js");
const request = require("request");

class Wotd extends SlashCommand {
  constructor (client) {
    super(client, {
      name: "wotd",
      description: "Sends today's WOTD.",
      category: "Tools",
      enabled: true,
      guildOnly: true,
      permLevel: "User",
      options: []
    });
  }

  async run (interaction, args, reply) { // eslint-disable-line no-unused-vars
    request("https://growtopiagame.com/detail", async (err, res, body) => {
        const json = JSON.parse(body);

        var wotd = json.world_day_images.full_size;
        wotd = wotd.split("/worlds/")[1].trim();
        wotd = wotd.split(".")[0].trim();

        const embed = new Discord.MessageEmbed()
          .setTitle("<:wotd:723221906660261939> World Of The Day <:wotd:723221906660261939>")
          .setDescription(`Visit the World **${wotd.toUpperCase()}** in Growtopia.`)
          .setImage(json.world_day_images.full_size)
          .setColor("GREEN")
          .setTimestamp();

        reply(embed);
    });
  }
}

module.exports = Wotd;