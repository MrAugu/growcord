const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");
const Settings = require("../models/settings.js");
const fs = require("fs");
const request = require("request");

class Send extends Command {
  constructor (client) {
    super(client, {
      name: "send",
      description: "Bulk sends webhooks of a specified type.",
      category: "Workers",
      usage: "<fnews, gnews, quest, votw> [content]",
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

    if (option === "quest") {
      var dailyQuest = fs.readFileSync("dailyQuest.json", { encoding: "utf8" });
      dailyQuest = JSON.parse(dailyQuest);

      var totalCost = (parseInt(dailyQuest.item1.price) / parseInt(dailyQuest.item1.quantity) * parseInt(dailyQuest.item1.needed)) + (parseInt(dailyQuest.item2.price) / parseInt(dailyQuest.item2.quantity) * parseInt(dailyQuest.item2.needed));
      const embed = new Discord.MessageEmbed()
        .setAuthor("Today's Daily Quest:", "https://cdn.discordapp.com/emojis/619959927120855060.png?v=1")
        .addField("Item #1:", `${dailyQuest.item1.needed} **${dailyQuest.item1.name}**\n<:wl:590139051563286529> ${dailyQuest.item1.quantity}/${dailyQuest.item1.price} WL${parseInt(dailyQuest.item1.price) > 1 ? "s" : ""}`)
        .addField("Item #2:", `${dailyQuest.item2.needed} **${dailyQuest.item2.name}**\n<:wl:590139051563286529> ${dailyQuest.item2.quantity}/${dailyQuest.item2.price} WL${parseInt(dailyQuest.item2.price) > 1 ? "s" : ""}`)
        .addField("Total", `<:wl:590139051563286529> ${isFloat(totalCost) ? totalCost.toFixed(1) : totalCost} WLs`)
        .setColor("GREEN")
        .setTimestamp();

      const msg = await reply("<a:loading:723213075683082272> Sending daily news are being sent, this may take a while...");
      await this.client.sendWebhook(embed, "dailyQuestChannel", "quest");
      msg.edit("<:greenTick:588667398593183754> The daily news announcement has been sent.");
    } else if (option === "votw") {
      return reply("❓ At this point in time, VOTW webhook has been disabled until further notice.");
      // ! -- Here Goes Code for VOTW -- !
    } else if (option === "status") {
      return reply("❓ At this point in time, status webhook has been disabled until further notice.");
      // ! -- Here Goes Code for status -- !
    } else if (option === "fnews") {
      const description = args.splice(1).join(" ");
      if (!description) return reply("Missing contents.");

      const embed = new Discord.MessageEmbed()
        .setTitle("Forum Newsletter")
        .setDescription(description)
        .setColor("GREEN")
        .setTimestamp();

      const msg = await reply("<a:loading:723213075683082272> Sending daily news are being sent, this may take a while...");
      await this.client.sendWebhook(embed, "forumNewsChannel", "forum-news");
      msg.edit("<:greenTick:588667398593183754> The forum news announcement has been sent.");
    } else if (option === "update") {
      if (!args[1]) return reply("Missing contents.");

      var [content, url] = args.slice(1).join(" ").split("|");
      if (!url && message.attachments.first()) url = message.attachments.first().proxyURL; 
      if (!content || !url) return reply("Bad format.");

      const embed = new Discord.MessageEmbed()
        .setTitle("Growtopia Newsletter")
        .setDescription(content)
        .setImage(url)
        .setColor("GREEN")
        .setTimestamp();

      const msg = await reply("<a:loading:723213075683082272> Sending daily news are being sent, this may take a while...");
      await this.client.sendWebhook(embed, "gameNewsChannel", "game-news");
      msg.edit("<:greenTick:588667398593183754> The update notification has been sent.");
    }
  }
}

module.exports = Send;

function isFloat(n){
  return Number(n) === n && n % 1 !== 0;
}