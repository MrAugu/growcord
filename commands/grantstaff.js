const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");

class Eval extends Command {
  constructor (client) {
    super(client, {
      name: "grantaccess",
      description: "Grants temporary staff permissions.",
      category: "Owner",
      usage: "[user ID]",
      enabled: true,
      guildOnly: false,
      aliases: ["ga"],
      permLevel: "Bot Admin",
      cooldown: 5,
      args: true
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    if(!args[0]) return message.reply("please provide a user ID!");
    if(isNaN(args[0])) return message.reply("invalid user ID provided!");
    var user = this.client.users.chache.get(args[0]);
    if(!user || user === null) return message.reply("the user you provided does not exist!");
    this.client.config.workers.push(args[0]);
    return message.reply(`<@${args[0]}> has been granted temporary staff access!`);
  }
}

module.exports = Eval;