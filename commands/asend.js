const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");
const Settings = require("../models/settings.js");
const fs = require("fs");
const request = require("request");

class Send extends Command {
  constructor (client) {
    super(client, {
      name: "asend",
      description: "Bulk sends webhooks of a specified type. Advanced embed builder.",
      category: "Workers",
      usage: "gnews Field Title/Field Description|Field 2 Title/Field 2 Description",
      enabled: true,
      guildOnly: true,
      aliases: [],
      permLevel: "Worker",
      cooldown: 5,
      args: true
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    const option = args[0];
    if (option === "gnews") {
      let embed = new Discord.MessageEmbed()
        .setTitle("Growtopia Newsletter")
        .setColor("GREEN")
        .setTimestamp();

      for (var i = 0; i < this.client.newsBuffer.length; i++) {
        embed.addField(this.client.newsBuffer[i].title, this.client.newsBuffer[i].description);
      }

      const msg = await reply("<a:loading:723213075683082272> Sending daily news are being sent, this may take a while...");
      await this.client.sendWebhook(embed, "gameNewsChannel", "game-news");
      msg.edit("<:greenTick:588667398593183754> The daily news announcement has been sent.");
    } else {
        return reply("Ugh no.");
      }
    }
  }

module.exports = Send;
