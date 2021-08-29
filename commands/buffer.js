const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");
const fs = require("fs");

class Buffer extends Command {
  constructor (client) {
    super(client, {
      name: "buffer",
      description: "Adds resets growtopia news buffer.",
      category: "Workers",
      usage: "<add/reset> [Field Title/Field Description]",
      enabled: true,
      guildOnly: true,
      aliases: [],
      permLevel: "Worker",
      cooldown: 5,
      args: true
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
      const option = args[0].toLowerCase();
      
      if (option === "add") {
        const [title, description] = args.slice(1).join(" ").split("/");
        if (!title) return reply("No title specified.");
        if (!description) return reply("No description specified.");

        var currentBuffer = fs.readFileSync("buffer.json", { encoding: "utf8" });
        currentBuffer = JSON.parse(currentBuffer);
        currentBuffer.push({ "title": title, "description": description });
        this.client.newsBuffer = currentBuffer;
        fs.writeFileSync("buffer.json", JSON.stringify(currentBuffer, null, 4), { encoding: "utf8" });
        return reply("<:greenTick:588667398593183754> Added to news buffer.");
      } else if (option === "reset") {
        this.client.newsBuffer = [];
        fs.writeFileSync("buffer.json", JSON.stringify([], null, 4), { encoding: "utf8" });
        return reply("<:greenTick:588667398593183754> News buffer reset.");
      } else if (option === "add-role-chef") {
        appendBuffer(this.client, "<:chef_hat:627894323530170369> Today is Chef Day!", "Your first Cooking quest will give 1 Growtoken and all Cooking quests will give 25% bonus points!");
        return reply("<:greenTick:588667398593183754> Added role of the day: chef to news buffer.");
      } else if (option === "add-role-star") {
        appendBuffer(this.client, "<:starhat:619957748385185812> Today is Star Captain's Day!", "Your first Startopia quest will give 1 Growtoken and all Startopia quests will give 25% bonus points!");
        return reply("<:greenTick:588667398593183754> Added role of the day: star to news buffer.");
      } else if (option === "add-role-fishing") {
        appendBuffer(this.client, "<:fishinghat:619957217592082472> Today is Fishing Day!", "Your first Fishing quest will give 1 Growtoken and all Fishing quests will give 25% bonus points!");
        return reply("<:greenTick:588667398593183754> Added role of the day: fishing to news buffer.");
      } else if (option === "add-role-surgeon") {
        appendBuffer(this.client, "<:thingamabob:619956180244234250> Today is Surgeon Day!", "Your first Surgeon quest will give 1 Growtoken and all Surgery quests will give 25% bonus points!");
        return reply("<:greenTick:588667398593183754> Added role of the day: surgey to news buffer.");
      } else if (option === "add-role-farmer") {
        appendBuffer(this.client, "<:trac:619960480449953843> Today is Farmer Day!", "Your first Farming quest will give 1 Growtoken and all Farming quests will give 25% bonus points!");
        return reply("<:greenTick:588667398593183754> Added role of the day: farmer to news buffer.");
      } else if (option === "add-role-builder") {
        appendBuffer(this.client, "<:fist:619955874756296725> Today is Builder Day!", "Your first Building quest will give 1 Growtoken and all Building quests will give 25% bonus points!");
        return reply("<:greenTick:588667398593183754> Added role of the day: builder to news buffer.");
      } else if (option === "add-role-alltrades") {
        appendBuffer(this.client, "<:growtoken:619959927120855060> Today is Jack of all Trades Day!", "Your first Role quest will give 1 Growtoken and all Role quests will give 25% bonus points!");
        return reply("<:greenTick:588667398593183754> Added role of the day: jack of all trades to news buffer.");
      } else if (option === "add-mutant-kitchen") {
        appendBuffer(this.client, "<:tentacle:656001749425061948> Mutant Kitchen", "Mutant Kitchen is here! Cook and eat Mutated consumables in Growtopia's Mutant Kitchen! Hurry, it only lasts 3 days!");
        return reply("<:greenTick:588667398593183754> Added Mutant Kitchen to news buffer.");
      } else if (option === "add-locke") {
        appendBuffer(this.client, "<:locke:619957131977949194> Traveling Salesman!", "A Traveling Salesman has come to Growtopia! Go trade him some of your Locks for fabulous items before he leaves town again!");
        return reply("<:greenTick:588667398593183754> Added Locke/Traveling Salesman to news buffer.");
      } else if (option === "add-howl-eve") {
        appendBuffer(this.client, "<:wolf:619957002210115603> Howl's Eve!", "Tonight is All Howl's Eve! The halls of Valhowla are open to the worthy!");
        return reply("<:greenTick:588667398593183754> Added Howl's Eve! to news buffer.");
      } else if (option === "add-carnival") {
        appendBuffer(this.client, "<:ringmaster:619957077715976192> Carnival!", "The Carnival has come to Growtopia! Try your luck at winning one of the ringmasters fabulous rings, or play some fun games to win some exclusive Carnival items in the world CARNIVAL! Hurry, it only lasts 3 days!");
        return reply("<:greenTick:588667398593183754> Added Carnival to news buffer.");
      } else if (option === "add-tournament") {
        appendBuffer(this.client, "<:tournament:619958910765367308> Tournament!", "The Grand Tournament has come to Growtopia! See who's the champion this month in the world TOURNAMENT.");
        return reply("<:greenTick:588667398593183754> Added Tournament to news buffer.");
      } else if (option === "add-comet") {
        appendBuffer(this.client, "<:comet:627406429023895552> It's the Night of the Comet!", "It's the Night of the Comet! Stardust is sprinkling down from the sky, and you just might be able to get items that can only be spliced in the cosmic energy of the comet!");
        return reply("<:greenTick:588667398593183754> Added Night of the Comet to news buffer.");
      } else if (option === "add-apocalypse") {
        appendBuffer(this.client, "<:gVirus:623355118779236372> It's a Zombie Apocalypse!", "It's a Zombie Apocalypse! The world lies in ruins. Maybe we can rebuild with the Mutated Cells that are appearing all around...");
        return reply("<:greenTick:588667398593183754> Added Zombie Apocalypse to news buffer.");
      } else if (option === "add-geiger-day") {
        appendBuffer(this.client, "<:geiger:619959758891384862> Today is Geiger Day!", "Today is Geiger Day! Geiger Counters recharge faster, among other surprises!");
        return reply("<:greenTick:588667398593183754> Added Geiger Day to news buffer.");
      } else if (option === "add-surgery-day") {
        appendBuffer(this.client, "<:stitches:658091733732818995> Today is Surgery Day!", "Today is Surgery Day! Malpractice and Recovering effects only last a few minutes, and bonus items can be found doing surgery.");
        return reply("<:greenTick:588667398593183754> Added Surgery Day to news buffer.");
      } else if (option === "ghost-day") {
        // Todo Yikes
        return reply("Ping the lazy owner with the text.");
      } else {
        return reply("<:redTick:588667371825135626> No such option exists.\n Current valid options: add <title>/<description>, reset, add-role-chef, add-role-star, add-role-fishing, add-role-surgeon, add-role-farmer, add-role-builder, add-role-alltrades, add-mutant-kitchen, add-locke, add-howl-eve, add-carnival, add-tournament, add-comet, add-apocalypse, add-geiger-day, add-surgery-day.");
      }
    }
  }

module.exports = Buffer;

function appendBuffer (client, title, description) {
    var currentBuffer = fs.readFileSync("buffer.json", { encoding: "utf8" });
    currentBuffer = JSON.parse(currentBuffer);
    currentBuffer.push({ "title": title, "description": description });
    client.newsBuffer = currentBuffer;
    fs.writeFileSync("buffer.json", JSON.stringify(currentBuffer, null, 4), { encoding: "utf8" });
}