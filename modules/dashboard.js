const Discord = require("discord.js");
const express = require("express");
const app = express();
const moment = require("moment");
require("moment-duration-format");
const helmet = require("helmet");
const fs = require("fs");
const { EmojiParser } =  require("discord-message-parser");
const marked = require("marked");

module.exports = (client) => {
  app.use(helmet());

  app.use((request, response, next) => {
    response.setHeader("Access-Control-Allow-Origin", "https://growstocks.xyz");
    next();
  });

  app.get("/api/news", async (request, response) => {
    const payload = [];

    for (const newItem of client.newsBuffer) {
      var title = newItem.title;
      const emojis = EmojiParser.parseEmojis(title);
      title = title.replace(/<:([^<]*):([^<]*)>/g, "");
      title = title.replace(/<a:([^<]*):([^<]*)>/g, "");
      title = title.trim();

      payload.push({
        title,
        description: marked(newItem.description),
        icon: emojis.customEmojis[0].id
      });
    }

    response.type("application/json").send(JSON.stringify(payload), null, 4);
  });

  var bodyParser = require("body-parser");
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  client.site = app.listen(client.config.dashboard.port, null, null, () => console.log("Dashboard is up and running."));
};
