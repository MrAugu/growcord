const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");
const fs = require("fs");

class SetQuest extends Command {
  constructor (client) {
    super(client, {
      name: "setquest",
      description: "Sets the daily quest.",
      category: "Workers",
      usage: "",
      enabled: true,
      guildOnly: false,
      aliases: [],
      permLevel: "Worker",
      cooldown: 5,
      args: false
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    const item1 = await this.client.awaitReply(message, "What's the first item name, be careful.", 120000);
    if (item1 === false) return reply("Timed  out.");

    const item2 = await this.client.awaitReply(message, "What's the second item name, be careful.", 120000);
    if (item1 === false) return reply("Timed  out.");

    const item1Price = await this.client.awaitReply(message, "What's the price of first item, be careful. (AMOUNT/PRICE, Example `1/2`)", 120000);
    if (item1Price === false) return reply("Timed  out.");

    const item2Price = await this.client.awaitReply(message, "What's the price of second item, be carefull. (AMOUNT/PRICE, Example `1/2`)", 120000);
    if (item2Price === false) return reply("Timed  out.");

    const item1Quanity = await this.client.awaitReply(message, "What's the amount of the first item required for the quest?", 120000);
    if (item1Quanity === false) return reply("Timed  out.");

    const item2Quanity = await this.client.awaitReply(message, "What's the amount of the second item required for the quest?", 120000);
    if (item2Quanity === false) return reply("Timed  out.");

    const consent = await this.client.awaitReply(message, `Do you want to set these as today's daily quest?\n**${item1Quanity} ${item1}** - ${item1Price.split("/")[0]}/${item1Price.split("/")[1]}\n${item2Quanity} **${item2}** - ${item2Price.split("/")[0]}/${item2Price.split("/")[1]}`);
    if (consent !== "yes") return reply("Action aborted.");

    const dailyQuest = {
        "item1": {
            name: item1,
            quantity: item1Price.split("/")[0],
            price: item1Price.split("/")[1],
            needed: item1Quanity
        },
        "item2": {
            name: item2,
            quantity: item2Price.split("/")[0],
            price: item2Price.split("/")[1],
            needed: item2Quanity
        }
    };

    fs.writeFileSync("dailyQuest.json", JSON.stringify(dailyQuest, null, 2));
    reply("<:greenTick:588667398593183754> Daily quest has been set.");
  }
}

module.exports = SetQuest;
