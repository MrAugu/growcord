const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");
const Settings = require("../models/settings.js");
const fs = require("fs");
const request = require("request");

class DailyQuest extends Command {
  constructor (client) {
    super(client, {
      name: "dailyquest",
      description: "Sends today's daily quest.",
      category: "Tools",
      usage: "",
      enabled: true,
      guildOnly: true,
      aliases: ["dq", "quest", "daily"],
      permLevel: "User",
      cooldown: 5,
      args: false
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    var dailyQuest = fs.readFileSync("dailyQuest.json", { encoding: "utf8" });
    dailyQuest = JSON.parse(dailyQuest);
    if (!dailyQuest.item1) return message.channel.send("No daily quest has been set.");

    var totalCost = (parseInt(dailyQuest.item1.price) / parseInt(dailyQuest.item1.quantity) * parseInt(dailyQuest.item1.needed)) + (parseInt(dailyQuest.item2.price) / parseInt(dailyQuest.item2.quantity) * parseInt(dailyQuest.item2.needed));
    const embed = new Discord.MessageEmbed()
          .setAuthor("Today's Daily Quest", "https://cdn.discordapp.com/emojis/619959927120855060.png?v=1")
          .setFooter(message.author.tag, message.author.displayAvatarURL({dyanmic: true}))
          .addField("[First Item]:", `${dailyQuest.item1.needed} ${dailyQuest.item1.name}\n<:wl:590139051563286529> ${dailyQuest.item1.quantity}/${dailyQuest.item1.price} World Lock${parseInt(dailyQuest.item1.price) > 1 ? "s" : ""}`)
          .addField("[Second Item]:", `${dailyQuest.item2.needed} ${dailyQuest.item2.name}\n<:wl:590139051563286529> ${dailyQuest.item2.quantity}/${dailyQuest.item2.price} World Lock${parseInt(dailyQuest.item2.price) > 1 ? "s" : ""}`)
          .addField("[Total Price]:", `<:wl:590139051563286529> ${`${totalCost.toFixed(2)}`.replace(".", ",").replace(",00", "")} World Locks`)
          .setTimestamp()
          .setColor("GREEN");
    reply(embed);
  }
}

module.exports = DailyQuest;

function isFloat(n){
  return Number(n) === n && n % 1 !== 0;
}