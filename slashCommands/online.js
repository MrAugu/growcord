const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const SlashCommand = require("../base/SlashCommand.js");
const request = require("request");

class Online extends SlashCommand {
  constructor (client) {
    super(client, {
      name: "online",
      description: "Shows the amount of online users at the moment.",
      category: "Tools",
      enabled: true,
      guildOnly: true,
      permLevel: "User",
      options: []
    });
  }

  async run (interaction, args, reply) { // eslint-disable-line no-unused-vars
    request("https://growtopiagame.com/detail", async (err, res, body) => {
      if (res.statusCode !== 200) return reply(`:x: Seems like Growtopia's Website goes trough some tough times. Website down. Demanded data could not be determined.`);
      const data = JSON.parse(body);
      reply(`<:status_online:590504284840525845> There are **${parseInt(data["online_user"]).toLocaleString()}** users online at the moment.`);
    });
  }
}

module.exports = Online;