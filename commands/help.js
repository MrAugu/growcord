const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");

class Help extends Command {
  constructor (client) {
    super(client, {
      name: "help",
      description: "Get help on how to use GrowCord.",
      category: "General",
      usage: "[category/alias]",
      enabled: true,
      guildOnly: false,
      aliases: ["halp"],
      permLevel: "User",
      cooldown: 5,
      args: false
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
      if (!args[0]) {
        const emb = new Discord.MessageEmbed()
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setColor("GREEN")
          .addField("General | `" + message.guild.settings.prefix + "help general`", `Commands every bot has.`)
          .addField("Settings | `" + message.guild.settings.prefix + "help settings`", `Commands to help you set up autoposting channels or bot settings for your server.`)
          .addField("Workers | `" + message.guild.settings.prefix + "help workers`", `Commands that help our staff team to deliver information.`)
          .addField("Tools | `" + message.guild.settings.prefix + "help tools`", `Useful tools that you will most likely use at some point.\n\n☎ Support Server: https://discord.gg/A7JCweZ`)
        reply(emb);
     } else if (args[0].toLowerCase() === "general") {
       var cmds = this.client.commands.filter(c => c.help.category === "General" && c.conf.enabled === true);
       cmds = cmds.map(cmd => `**${cmd.help.name.toProperCase()} | \`${message.guild.settings.prefix}${cmd.help.name}\`**\n${cmd.help.description}`)

       const emb = new Discord.MessageEmbed()
         .setAuthor(message.author.tag, message.author.displayAvatarURL())
         .setColor("GREEN")
         .setDescription(`${cmds.join("\n")}\n\n☎ Support Server: https://discord.gg/A7JCweZ`);
        reply(emb);
     } else if (args[0].toLowerCase() === "settings") {
       var cmds = this.client.commands.filter(c => c.help.category === "Settings" && c.conf.enabled === true);
       cmds = cmds.map(cmd => `**${cmd.help.name.toProperCase()} | \`${message.guild.settings.prefix}${cmd.help.name}\`**\n${cmd.help.description}`)

       const emb = new Discord.MessageEmbed()
         .setAuthor(message.author.tag, message.author.displayAvatarURL())
         .setColor("GREEN")
         .setDescription(`${cmds.join("\n")}\n\n☎ Support Server: https://discord.gg/A7JCweZ`);
        reply(emb);
     } else if (args[0].toLowerCase() === "tools") {
       var cmds = this.client.commands.filter(c => c.help.category === "Tools" && c.conf.enabled === true);
       cmds = cmds.map(cmd => `**${cmd.help.name.toProperCase()} | \`${message.guild.settings.prefix}${cmd.help.name}\`**\n${cmd.help.description}`)

       const emb = new Discord.MessageEmbed()
         .setAuthor(message.author.tag, message.author.displayAvatarURL())
         .setColor("GREEN")
         .setDescription(`${cmds.join("\n")}\n\n☎ Support Server: https://discord.gg/A7JCweZ`);
        reply(emb);
     } else if (args[0].toLowerCase() === "workers") {
      var cmds = this.client.commands.filter(c => c.help.category === "Workers" && c.conf.enabled === true);
      cmds = cmds.map(cmd => `**${cmd.help.name.toProperCase()} | \`${message.guild.settings.prefix}${cmd.help.name}\`**\n${cmd.help.description}`)

      const emb = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor("GREEN")
        .setDescription(`${cmds.join("\n")}\n\n☎ Support Server: https://discord.gg/A7JCweZ`);
       reply(emb);
    } else {
       const command = this.client.commands.get(args[0].toLowerCase());
       if (!command) return reply(`<:redTick:588667371825135626> Command/Category/Alias not found.`);
       var enab = command.conf.enabled ? "Yes" : "No";
       var cperm = command.conf.permLevel;
       const emb = new Discord.MessageEmbed()
         .setAuthor(message.author.tag, message.author.displayAvatarURL())
         .setColor("GREEN")
         .setDescription(`${command.help.name.toProperCase()} | Info\n**Name**: ${command.help.name}\n**Description**: ${command.help.description}\n**Category**: ${command.help.category}\n**Usage**: \`${message.guild.settings.prefix}${command.help.name} ${command.help.usage}\`\n**Cooldown**: ${command.conf.cooldown} Seconds\n**Minimum Rank**: ${command.conf.rank}\n**Enabled**: ${enab}\n**Permission Level**: ${cperm}\n\n☎ Support Server: https://discord.gg/A7JCweZ`);
       reply(emb);
     }

  }
}

module.exports = Help;
