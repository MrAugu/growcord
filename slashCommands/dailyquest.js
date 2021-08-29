const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const SlashCommand = require("../base/SlashCommand.js");
const fs = require("fs");

class DailyQuest extends SlashCommand {
  constructor (client) {
    super(client, {
      name: "dailyquest",
      description: "Sends today's daily quest.",
      category: "Tools",
      enabled: true,
      guildOnly: true,
      permLevel: "User",
      options: []
    });
  }

  async run (interaction, args, reply) { // eslint-disable-line no-unused-vars
    var dailyQuest = fs.readFileSync("dailyQuest.json", { encoding: "utf8" });
    dailyQuest = JSON.parse(dailyQuest);
    if (!dailyQuest.item1) return reply("No daily quest has been set.");

    var totalCost = (parseInt(dailyQuest.item1.price) / parseInt(dailyQuest.item1.quantity) * parseInt(dailyQuest.item1.needed)) + (parseInt(dailyQuest.item2.price) / parseInt(dailyQuest.item2.quantity) * parseInt(dailyQuest.item2.needed));
    const embed = new Discord.MessageEmbed()
          .setAuthor("Today's Daily Quest:", "https://cdn.discordapp.com/emojis/619959927120855060.png?v=1")
          .addField("Item #1:", `${dailyQuest.item1.needed} **${dailyQuest.item1.name}**\n<:wl:590139051563286529> ${dailyQuest.item1.quantity}/${dailyQuest.item1.price} WL${parseInt(dailyQuest.item1.price) > 1 ? "s" : ""}`)
          .addField("Item #2:", `${dailyQuest.item2.needed} **${dailyQuest.item2.name}**\n<:wl:590139051563286529> ${dailyQuest.item2.quantity}/${dailyQuest.item2.price} WL${parseInt(dailyQuest.item2.price) > 1 ? "s" : ""}`)
          .addField("Total", `<:wl:590139051563286529> **${totalCost}**`)
          .setColor("GREEN")
          .setTimestamp();
    reply(embed);
  }
}

module.exports = DailyQuest;