const Discord = require("discord.js");
const cooldowns = new Discord.Collection();
const config = require("../config.js");
const pref = config.prefix;
const Settings = require("../models/settings.js");
const Error = require("../models/error.js");
const fs = require("fs");
const moment = require("moment");

module.exports = class {
  constructor (client) {
    this.client = client;
  }

  async run (message) {
    function getDmLvl (message, client) { if (message.author.id === client.appInfo.owner.id) { return 10; } else if (client.config.admins.includes(message.author.id)) { return 9; } else { return 0; } }
    const reply = (c) => message.channel.send(c);
    const guildSettings = message.channel.type === "text" ? await Settings.findOne({ guildID: message.guild.id }) : { prefix: "?" };
    if (message.guild) message.guild.settings = guildSettings;
    if (!guildSettings && message.guild) {
      const newSettings = new Settings({
        guildID: message.guild.id,
        prefix: pref,
        tweetChannel: "",
        wotdChannel: "",
        forumNewsChannel: "",
        serverStatusChannel: "",
        votwChannel: "",
        gameNewsChannel: "",
        dailyQuestChannel: "",
        mentions: [],
        marketplaceChannel: ""
      });

      await newSettings.save().catch(e => this.client.logger.log(e, "error"));
      return undefined;
    }

    const level = message.channel.type === "text" ? this.client.permlevel(message.member, this.client) : getDmLvl(message, this.client);
    const mentionHelp = new RegExp(`^<@!?${this.client.user.id}>( |)$`);
    if (message.content.match(mentionHelp)) {
      return reply(`Hey there, my prefix is \`${guildSettings.prefix}\`.`);
    }

    if (message.content.indexOf(guildSettings.prefix) !== 0) return;

    const args = message.content.slice(guildSettings.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if (message.guild && !message.member) await message.guild.fetchMember(message.author);
    const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
    const usrs = fs.readFileSync("botbans.json", "utf8");
    if (cmd && usrs.includes(message.author.id)) return reply("<:redTick:588667371825135626> Seems like you can't acces this. You've been banned by one of bot admins for more details regarding your case and appeal info, join our support server. (`-support`)");
    if (!cmd && this.client.cmdMaintenance === true) return;

    if (!cmd) return;
    if (level < 9 && this.client.cmdMaintenance === true) return reply("<:redTick:588667371825135626> We are currently undergoing a maintenance we'll be back soon.");
    if (cmd.conf.enabled === false) return reply("<:redTick:588667371825135626> This command is currently globally disabled.");
    if (cmd && !message.guild && cmd.conf.guildOnly) return message.channel.send("<:redTick:588667371825135626> This command is unavailable via private message. Please run this command in a server.");

    if (cmd.conf.args === true && !args.length) {
      return reply(`<:redTick:588667371825135626> You haven't provided any argument.\nCorrect Usage: \`${guildSettings.prefix}${cmd.help.name} ${cmd.help.usage}\``);
    }

    if (!cooldowns.has(cmd.help.name)) {
      cooldowns.set(cmd.help.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(cmd.help.name);
    const cooldownAmount = cmd.conf.cooldown * 1000;

    if (message.author.id !== "414764511489294347" && message.author.id !== "") {
      if (!timestamps.has(message.author.id)) {
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
      } else {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
          const timeLeft = (expirationTime - now) / 1000;
          return reply(`<:redTick:588667371825135626> Slow it down dude. You have to wait ${timeLeft.toFixed(1)} seconds before using \`${cmd.help.name}\` again.`);
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
      }
    }

    const noPermEmbed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL)
      .setTitle("FORBIDDEN!")
      .setColor("#36393e")
      .setAuthor(message.author.tag, message.author.avatarURL)
      .setDescription(`
<:redTick:588667371825135626> Forbidden! You do not have the required permissions to use \`${cmd.help.name}\`.

▫ Required Permission Level: ${this.client.levelCache[cmd.conf.permLevel]} - ${cmd.conf.permLevel}
▫ Your Permission Level: ${level} - ${this.client.config.permLevels.find(l => l.level === level).name}
          `)
      .setTimestamp();

    if (level < this.client.levelCache[cmd.conf.permLevel]) return reply(noPermEmbed);

    message.author.permLevel = level;

    const timestamp = `[${moment().format("YYYY-MM-DD HH:mm:ss")}]:`;
    const content = `${timestamp} ${message.author.tag} (ID:${message.author.id}) ran ${cmd.help.name} in ${message.guild ? message.guild.name : "DMs"} (ID: ${message.guild ? message.guild.id : "0"})
    Raw Input |${message.content}|
    `;

    fs.appendFileSync("log.txt", content, "utf8");

    try {
      await cmd.run(message, args, level, reply);
    } catch (e) {
      const errorCode = Date.now().toString(36);
      const newErr = new Error({
        errCode: errorCode,
        err: e,
        errTimestamp: message.createdAtTimestamp,
        errPath: `/home/root/bots/growcord/commands/${cmd.help.name}.js`
      });
      await newErr.save().catch(e => console.log(e));
      this.client.logger.error(e);
      reply(`<:redTick:588667371825135626> Internal error occured!\nError Code: \`${errorCode}\`\nPlease report this error to the developers. Type \`${guildSettings.prefix}invite\` to get a link to the support server.`);
      //this.client.channels.cache.get("584321456360390696").send(`An internal error occured while running \`${cmd.help.name}.js\`.\n\`\`\`xl\n${e}\`\`\``);
    }
  }
};
