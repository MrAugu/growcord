const io = require("@pm2/io");
io.init({ transactions: true, http: true });

if (Number(process.version.slice(1).split(".")[0]) < 8) throw new Error("Node 8.0.0 or higher is required. Update Node on your system.");

const { Client, Collection } = require("discord.js");
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const klaw = require("klaw");
const path = require("path");
const Settings = require("./models/settings.js");
const { Request } = require("hclientify");

const config = require("./config.js");
const mongoose = require("mongoose");
const databaseUrl = config.dbUrl;

mongoose.connect(databaseUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

class Bot extends Client {
  constructor (options) {
    super(options);
    this.cmdMaintenance = false;
    this.state = {};
    this.config = require("./config.js");
    this.commands = new Collection();
    this.aliases = new Collection();
    this.slashCommands = new Collection();
  
    /* Interaction DIY Integraton - Dispatching raw ws event to DIY event. */
    this.ws.on("INTERACTION_CREATE", interaction => {
      this.emit("interactionReceive", interaction);
    });

    this.logger = require("./modules/logger.js");

    this.wait = require("util").promisify(setTimeout);

    this.awaitReply = async (msg, question, limit = 60000) => {
      const filter = m => m.author.id === msg.author.id;
      await msg.channel.send(question);
      try {
        const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
        return collected.first().content;
      } catch (e) {
        return false;
      }
    };

    this.awaitMessageReply = async (msg, question, limit = 60000) => {
      const filter = m => m.author.id === msg.author.id;
      const ms = await msg.channel.send(question);
      try {
        const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
        collected.first().content;
        return {
          reply: collected.first(),
          original: ms
        };
      } catch (e) {
        return false;
      }
    };

    this.sendWebhook = async (embed, type, mentions) => {
      const allSettings = await Settings.find();
      for (const set of allSettings) {
        let mentionMessage = "";
        if (!set.mentions) set.mentions = [];
        const m = set.mentions.filter(obj => obj.type === mentions);
        m.forEach(m => mentionMessage += ` <@&${m.role}>`);
        const guild = this.guilds.cache.get(set.guildID);
        if (guild) {
          const channel = guild.channels.cache.get(set[type]);
          if (channel) {
            channel.send(mentionMessage, embed).catch(e=>{});
            await this.wait(150);
          }
        }
      }
      return;
    };

    this.isWorker = (member) => {
      return false; /* TO-DO */ 
    };

    this.clean = async (client, text) => {
      if (text && text.constructor.name == "Promise") text = await text;
      if (typeof evaled !== "string") text = require("util").inspect(text, {depth: 0});

      text = text.replace(/`/g, "`" + String.fromCharCode(8203))
        .replace(/@/g, "@" + String.fromCharCode(8203))
        .replace(client.token, null)
        .replace(this.config.dbUrl, "mongodb:bot:67hdk3@ds067781.mlab.com:5702/bot");

      return text;
    };

    this.stateInterval = setInterval(() => {

    }, 15000);
  }

  permlevel (member, client) {
    let permlvl = 0;

    const permOrder = this.config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);

    while (permOrder.length) {
      const currentLevel = permOrder.shift();
      if (currentLevel.check(member, client)) {
        permlvl = currentLevel.level;
        break;
      }
    }
    return permlvl;
  }

  loadCommand (commandPath, commandName, slash = false) {
    try {
      const props = new (require(`${commandPath}${path.sep}${commandName}`))(this);
      this.logger.log(`Loading Command: ${props.help.name}`, "log");
      props.conf.location = commandPath;
      if (props.init) {
        props.init(this);
      }
      if (slash === false) {
        this.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
          this.aliases.set(alias, props.help.name);
        });
      } else {
        this.slashCommands.set(props.help.name, props);
        console.log("Loaded slash command.");
      }
      return false;
    } catch (e) {
      return `Unable to load command ${commandName}: ${e}`;
    }
  }

  async unloadCommand (commandPath, commandName) {
    let command;
    if (this.commands.has(commandName)) {
      command = this.commands.get(commandName);
    } else if (this.aliases.has(commandName)) {
      command = this.commands.get(this.aliases.get(commandName));
    }
    if (!command) return `The command \`${commandName}\` doesn"t seem to exist, nor is it an alias. Try again!`;

    if (command.shutdown) {
      await command.shutdown(this);
    }
    delete require.cache[require.resolve(`${commandPath}${path.sep}${commandName}.js`)];
    return false;
  }
}

const client = new Bot({
  intents: ["GUILDS", "GUILD_MESSAGES"]
});

const init = async () => {
  klaw("./commands").on("data", (item) => {
    const cmdFile = path.parse(item.path);
    if (!cmdFile.ext || cmdFile.ext !== ".js") return;
    const response = client.loadCommand(cmdFile.dir, `${cmdFile.name}${cmdFile.ext}`);
    if (response) client.logger.error(response);
  });

  klaw("./slashCommands").on("data", (item) => {
    const cmdFile = path.parse(item.path);
    if (!cmdFile.ext || cmdFile.ext !== ".js") return;
    const response = client.loadCommand(cmdFile.dir, `${cmdFile.name}${cmdFile.ext}`, true);
    if (response) client.logger.error(response);
  });

  const evtFiles = await readdir("./events/");
  client.logger.log(`Loading a total of ${evtFiles.length} events.`, "log");
  evtFiles.forEach(file => {
    if (file.split(".")[1] !== "js") return;
    const eventName = file.split(".")[0];
    // client.logger.log(`Loading Event: ${eventName}`);
    const event = new (require(`./events/${file}`))(client);
    client.on(eventName, (...args) => event.run(...args));
    delete require.cache[require.resolve(`./events/${file}`)];
  });

  client.levelCache = {};
  for (let i = 0; i < client.config.permLevels.length; i++) {
    const thisLevel = client.config.permLevels[i];
    client.levelCache[thisLevel.name] = thisLevel.level;
  }
  client.login(client.config.token);
};

init();

client.on("disconnect", () => client.logger.warn("Bot is disconnecting..."));
client.on("reconnecting", () => client.logger.log("Bot reconnecting...", "log"));
client.on("error", e => client.logger.error(e));
client.on("warn", info => client.logger.warn(info));
client.on("debug", async info => {
  if (/(Sending a heartbeat|Latency of)/i.test(info)) return null;
  //client.logger.log(await client.clean(client, info))
});

module.exports.Client = client;

process.on("uncaughtException", (err) => {
  const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
  console.error("Uncaught Exception: ", errorMsg);
  process.exit(1);
});

String.prototype.toProperCase = function() {
  return this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}; 

Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)];
};

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};