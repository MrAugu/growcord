const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const SlashCommand = require("../base/SlashCommand.js");

class Help extends SlashCommand {
  constructor (client) {
    super(client, {
      name: "help",
      description: "Lists the available slash commands.",
      enabled: true,
      guildOnly: true,
      permLevel: "User",
      category: "General",
      options: [{
        type: 3,
        name: "category",
        description: "The category of commands you want to see.",
        required: false,
        choices: [{ name: "general", value: "general"}, {name: "settings", value: "settings"}, {name: "tools", value: "tools"}, {name: "workers", value: "workers"}]
      }]
    });
  }

  async run (interaction, args, reply) { // eslint-disable-line no-unused-vars
    if (!args[0]) {
        const emb = new Discord.MessageEmbed()
          .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
          .setColor("GREEN")
          .addField("General | `/help general`", `Commands every bot has.`)
          .addField("Settings | `/help settings`", `Commands to help you set up autoposting channels or bot settings for your server.`)
          .addField("Workers | `/help workers`", `Commands that help our staff team to deliver information.`)
          .addField("Tools | `/help tools`", `Useful tools that you will most likely use at some point.\n\n☎ Support Server: https://discord.gg/A7JCweZ`)
        reply(emb);
     } else if (args[0].toLowerCase() === "general") {
       var cmds = this.client.slashCommands.filter(c => c.help.category === "General" && c.conf.enabled === true);
       cmds = cmds.map(cmd => `**${cmd.help.name.toProperCase()} | \`${interaction.guild.settings.prefix}${cmd.help.name}\`**\n${cmd.help.description}`)

       const emb = new Discord.MessageEmbed()
         .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
         .setColor("GREEN")
         .setDescription(`${cmds.join("\n")}\n\n☎ Support Server: https://discord.gg/A7JCweZ`);
        reply(emb);
     } else if (args[0].toLowerCase() === "settings") {
       var cmds = this.client.slashCommands.filter(c => c.help.category === "Settings" && c.conf.enabled === true);
       cmds = cmds.map(cmd => `**${cmd.help.name.toProperCase()} | \`${interaction.guild.settings.prefix}${cmd.help.name}\`**\n${cmd.help.description}`)

       const emb = new Discord.MessageEmbed()
         .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
         .setColor("GREEN")
         .setDescription(`${cmds.join("\n") || "No commands from this section have been added to the slash command list."}\n\n☎ Support Server: https://discord.gg/A7JCweZ`);
        reply(emb);
     } else if (args[0].toLowerCase() === "tools") {
       var cmds = this.client.slashCommands.filter(c => c.help.category === "Tools" && c.conf.enabled === true);
       cmds = cmds.map(cmd => `**${cmd.help.name.toProperCase()} | \`${interaction.guild.settings.prefix}${cmd.help.name}\`**\n${cmd.help.description}`)

       const emb = new Discord.MessageEmbed()
         .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
         .setColor("GREEN")
         .setDescription(`${cmds.join("\n") || "No commands from this section have been added to the slash command list."}\n\n☎ Support Server: https://discord.gg/A7JCweZ`);
        reply(emb);
     } else if (args[0].toLowerCase() === "workers") {
      var cmds = this.client.slashCommands.filter(c => c.help.category === "Workers" && c.conf.enabled === true);
      cmds = cmds.map(cmd => `**${cmd.help.name.toProperCase()} | \`${interaction.guild.settings.prefix}${cmd.help.name}\`**\n${cmd.help.description}`)

      const emb = new Discord.MessageEmbed()
        .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
        .setColor("GREEN")
        .setDescription(`${cmds.join("\n")}\n\n☎ Support Server: https://discord.gg/A7JCweZ`);
       reply(emb);
    } else {
       const command = this.client.slashCommands.get(args[0].toLowerCase());
       if (!command) return reply(`<:redTick:588667371825135626> Command/Category/Alias not found.`);
       var enab = command.conf.enabled ? "Yes" : "No";
       var cperm = command.conf.permLevel;
       const emb = new Discord.MessageEmbed()
         .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
         .setColor("GREEN")
         .setDescription(`${command.help.name.toProperCase()} | Info\n**Name**: ${command.help.name}\n**Description**: ${command.help.description}\n**Category**: ${command.help.category}\n**Usage**: \`${interaction.guild.settings.prefix}${command.help.name} ${command.help.usage}\`\n**Cooldown**: ${command.conf.cooldown} Seconds\n**Minimum Rank**: ${command.conf.rank}\n**Enabled**: ${enab}\n**Permission Level**: ${cperm}\n\n☎ Support Server: https://discord.gg/A7JCweZ`);
       reply(emb);
     }

  }
}

module.exports = Help;