const Discord = require("discord.js"); // eslint-disable-line no-unused-vars
const fs = require("fs");
const request = require("request");

module.exports = class {
  constructor (client) {
    this.client = client;
  }

  async run () {
    // for (const [name, cmd] of this.client.slashCommands) {
    //   this.client.api.applications(this.client.user.id).commands.post({
    //     data: {
    //       name: cmd.help.name,
    //       description: cmd.help.description,
    //       options: cmd.help.options.length < 1 ? undefined : cmd.help.options
    //     }
    //   }).then(console.log);
    // }

    try {
      require("../wotd.json");
    } catch (e) {
      fs.writeFileSync("wotd.json", JSON.stringify({}));
    }

    try {
      require("../votw.json");
    } catch (e) {
      fs.writeFileSync("votw.json", JSON.stringify({}));
    }

    try {
      require("../dailyQuest.json");
    } catch (e) {
      fs.writeFileSync("dailyQuest.json", JSON.stringify({}));
    }

    try {
      require("../tweets.json");
    } catch (e) {
      fs.writeFileSync("tweets.json", JSON.stringify([]));
    }

    try {
      require("../buffer.json");
    } catch (e) {
      fs.writeFileSync("buffer.json", JSON.stringify([]));
    }

    var dailyQuest = fs.readFileSync("dailyQuest.json", { encoding: "utf8" });
    dailyQuest = JSON.parse(dailyQuest);

    this.client.dq = dailyQuest;

    setInterval(() => {
      var dailyQuest1 = fs.readFileSync("dailyQuest.json", { encoding: "utf8" });
      dailyQuest1 = JSON.parse(dailyQuest1);
  
      this.client.dq = dailyQuest1;
    }, 180000);

    this.client.wotd = fs.readFileSync("wotd.json", "utf8");

    var clientTweetStore = fs.readFileSync("tweets.json", { encoding: "utf8" });
    clientTweetStore = JSON.parse(clientTweetStore);
    this.client.tweetStore = clientTweetStore;

    var currentBuffer = fs.readFileSync("buffer.json", { encoding: "utf8" });
    currentBuffer = JSON.parse(currentBuffer);
    this.client.newsBuffer = currentBuffer;

    this.client.appInfo = await this.client.fetchApplication();
    setInterval( async () => {
      this.client.appInfo = await this.client.fetchApplication();
    }, 60000);

    await this.client.user.setStatus("online");

    const statusArray = [
      (client) => client.user.setActivity(`${this.client.guilds.cache.size} Servers | -help`, { type: "WATCHING" }),
      (client) => client.user.setActivity(`${this.client.channels.cache.size} Channels | -help`, { type: "WATCHING" })
    ];

    var pick = 0;
    setInterval(() => {
      statusArray[pick](this.client);
      pick += 1;
      if (pick === 2) pick = 0;
    }, 40000);

    let users = 0;
    this.client.guilds.cache.map(g => users += g.memberCount);

    this.client.dashboard = require("../modules/dashboard.js")(this.client);
    this.client.logger.log(`Logged in as ${this.client.user.tag}! Serving ${this.client.guilds.cache.size} Servers and ${users} Users.`, "ready");
    this.client.readyState = true;

    this.client.on("message", async (message) => {
      if (message.channel.id !== "588648077393657867") return;
      if (message.content.split("|||").length !== 2) return;
      if (message.content.split("|||")[1].trim().replaceAll("&nbsp;", "\n").startsWith("@")) return;
      if (!message.webhookID) return;

      var tweetStore = fs.readFileSync("tweets.json", { encoding: "utf8" });
      tweetStore = JSON.parse(tweetStore);
      tweetStore.push(message.content.split("|||")[1].trim().replaceAll("&nbsp;", "<br>").replaceAll("&amp;", "&").replaceAll("\n", "<br>"));
      this.client.tweetStore = tweetStore;
      fs.writeFileSync("tweets.json", JSON.stringify(tweetStore, null, 4), { encoding: "utf8" });

      if (message.content.split("|||")[0].trim() === "TW") {
        const embed = new Discord.MessageEmbed()
        .setTitle("New Tweet")
        .setDescription(message.content.split("|||")[1].trim().replaceAll("&nbsp;", "\n").replaceAll("&amp;", "&"))
        .setColor("BLUE")
        .setTimestamp();

        await this.client.sendWebhook(embed, "tweetChannel", "tweet");
      }

      if (message.content.split("|||")[0].trim() === "AS") {
        const embed = new Discord.MessageEmbed()
        .setTitle("Update Available")
        .setDescription(message.content.split("|||")[1].trim().replaceAll("&nbsp;", "\n"))
        .setColor("GREEN")
        .setTimestamp();

        await this.client.sendWebhook(embed, "gameNewsChannel", "game-news");
      }
    });

    setInterval(() => {
      request("https://growtopiagame.com/detail", async (err, res, body) => {
        const json = JSON.parse(body);
        if (!json.world_day_images) return;
        if (!json.world_day_images.full_size);

        var updatedWotd = json.world_day_images.full_size;
        updatedWotd = updatedWotd.split("/worlds/")[1].trim();
        updatedWotd = updatedWotd.split(".")[0].trim();

        if (updatedWotd.length < 2) return;
        updatedWotd = updatedWotd.toUpperCase();
        var currentWotd = this.client.wotd;
        currentWotd = JSON.parse(currentWotd);

        if (updatedWotd !== currentWotd.wotd_name && (Date.now() - currentWotd.lastUpdated) > 21600000 || !currentWotd.wotd_name || !currentWotd.lastUpdated) {
          fs.writeFileSync("wotd.json", JSON.stringify({ "wotd_name": updatedWotd, "lastUpdated": Date.now() }, null, 2));
          this.client.wotd = JSON.stringify({ "wotd_name": updatedWotd, "lastUpdated": Date.now() });

          const embed = new Discord.MessageEmbed()
            .setTitle("<:wotd:723221906660261939> World Of The Day <:wotd:723221906660261939>")
            .setDescription(`Visit the World **${updatedWotd}** in Growtopia.`)
            .setImage(json.world_day_images.full_size)
            .setColor("GREEN")
            .setTimestamp();

          this.client.sendWebhook(embed, "wotdChannel", "wotd");
        }
      });
    }, 180000);

    this.client.on("message", async (message) => {
      if (message.channel.id !== "588648077393657867") return;
      if (!message.webhookID || message.webhookID !== "656924898886680579") return;
      if (!message.embeds[0]) return;
      if (!message.embeds[0].fields[0]) return;
      if (!message.embeds[0].footer) return;
      if (!message.embeds[0].footer.text) return;
      if (!message.embeds[0].footer.text.includes("(☎ 12345)") || !message.embeds[0].footer.text.includes("Item price")) return;
      if (!message.embeds[0].author) return;
      if (!message.embeds[0].author.name.includes("Growtopia Daily Announcements")) return;

      var [first, second] = message.embeds[0].fields[0].value.split("\n");

      var firstAmount = first.split(" ")[0];
      var secondAmount = second.split(" ")[0];

      first = first.split(" ").slice(1).join(" ");
      second = second.split(" ").slice(1).join(" ");

      var [firstItem, firstRawPrice] = first.split("for").map(i => i.trim());
      var [secondItem, secondRawPrice] = second.split("for").map(i => i.trim());

      firstRawPrice = firstRawPrice.split("w")[0];
      secondRawPrice = secondRawPrice.split("w")[0];
      if (!first || !second || !firstItem || !secondItem || !firstRawPrice || !secondRawPrice) return;
      var deily = fs.readFileSync("dailyQuest.json", { encoding: "utf8" });
      deily = JSON.parse(deily);
      if (deily.item1.name === firstItem || deily.item2.name === secondItem) return;

      const dailyQuest = {
        "item1": {
            name: firstItem,
            quantity: firstAmount,
            price: firstRawPrice,
            needed: firstAmount
        },
        "item2": {
            name: secondItem,
            quantity: secondAmount,
            price: secondRawPrice,
            needed: secondAmount
        }
      };
 
      fs.writeFileSync("dailyQuest.json", JSON.stringify(dailyQuest, null, 2));
      
      const embed = new Discord.MessageEmbed()
        .setAuthor("Today's Daily Quest:", "https://cdn.discordapp.com/emojis/619959927120855060.png?v=1")
        .addField("Item #1:", `${dailyQuest.item1.needed} **${dailyQuest.item1.name}**\n<:wl:590139051563286529> ${dailyQuest.item1.quantity}/${dailyQuest.item1.price} WL${parseInt(dailyQuest.item1.price) > 1 ? "s" : ""}`)
        .addField("Item #2:", `${dailyQuest.item2.needed} **${dailyQuest.item2.name}**\n<:wl:590139051563286529> ${dailyQuest.item2.quantity}/${dailyQuest.item2.price} WL${parseInt(dailyQuest.item2.price) > 1 ? "s" : ""}`)
        .addField("Total", `<:wl:590139051563286529> ${parseInt(firstRawPrice) + parseInt(secondRawPrice)} WLs\nThis quest has been taken from [Jenulot's Tavern](https://discord.gg/jenulot).`)
        .setColor("GREEN")
        .setTimestamp();

      await this.client.sendWebhook(embed, "dailyQuestChannel", "quest");
    });
  }
};
