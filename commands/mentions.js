const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");
const Settings = require("../models/settings.js");

class Mentions extends Command {
  constructor (client) {
    super(client, {
      name: "mentions",
      description: "Set the bot to mention roles upon news delivering.",
      category: "Settings",
      usage: "<add/remove> [type] <role>",
      enabled: true,
      guildOnly: true,
      aliases: [],
      permLevel: "Moderator",
      cooldown: 5,
      args: true
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    const ar = args[0];
    if (!ar) return reply("You have to specify if you want to add a menton or to remove a mention.");
    const type = args[1];
    if (!type) return reply("You have to specify the type, current valid types: `digest`, `tweet`, `quest`, `wotd`, `votw`, `game-news`, `forum-news`, `server-status`");
    const role = message.mentions.roles.first() || args[2];
    if (type === "remove" && !role) return reply("You have to mention the role you want to add or remove.");

    if (ar.toLowerCase() === "add") {
        let obj;
        if (type.toLowerCase() === "digest") {
            obj = {
                type: "digest",
                role: role.id ? role.id : role
            };
        } else if (type.toLowerCase() === "tweet") {
            obj = {
                type: "tweet",
                role: role.id ? role.id : role
            };
        } else if (type.toLowerCase() === "quest") {
            obj = {
                type: "quest",
                role: role.id ? role.id : role
            };
        } else if (type.toLowerCase() === "wotd") {
            obj = {
                type: "wotd",
                role: role.id ? role.id : role
            };
        } else if (type.toLowerCase() === "votw") {
            obj = {
                type: "votw",
                role: role.id ? role.id : role
            };
        } else if (type.toLowerCase() === "game-news") {
            obj = {
                type: "game-news",
                role: role.id ? role.id : role
            };
        } else if (type.toLowerCase() === "forum-news") {
            obj = {
                type: "forum-news",
                role: role.id ? role.id : role
            };
        } else if (type.toLowerCase() === "server-status") {
            obj = {
                type: "server-status",
                role: role.id ? role.id : role
            };
        } else {
            return reply("Invalid type, current valid types: `digest`, `tweet`, `quest`, `wotd`, `votw`, `game-news`, `forum-news`, `server-status`");
        }

        Settings.findOne({
            guildID: message.guild.id
        }, async (err, settings) => {
            if (err) this.client.logger.log(err, "error");
            if (!settings.mentions) settings.mentions = [];
            settings.mentions.push(obj);
            await settings.save().catch(e => this.client.logger.log(e, "error"));
            return reply("Mention has been added!");
        });

    } else if (ar.toLowerCase() === "remove") {
        Settings.findOne({
            guildID: message.guild.id
        }, async (err, settings) => {
            if (err) this.client.logger.log(err, "error");
            if (!settings.mentions) return reply("You haven't added any mentions so far.");
            const r = role.id ? role.id : role;
            for (const mention of settings.mentions) {
                const index = settings.mentions.findIndex(object => object.role === r);
                settings.mentions.splice(index, 1);
            }
            await settings.save().catch(e => this.client.logger.log(e, "error"));
            return reply("Mention has been removed from all of the types it has been added to.");
        });
    }
  }
}

module.exports = Mentions;
