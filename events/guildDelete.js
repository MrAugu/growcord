const Discord = require("discord.js"); // eslint-disable-line no-unused-vars

module.exports = class {
  constructor (client) {
    this.client = client;
  }

  async run (guild) {
    const leaveEmbed = new Discord.MessageEmbed()
      .setTitle("Left a Server!")
      .setThumbnail(guild.iconURL)
      .setDescription(`
- Name: ${guild.name}
- Owner ID: ${guild.ownerID}
- Member Count: ${guild.memberCount}
- ID: ${guild.id}
- Created On: ${guild.createdAt}

- Current Server Count: ${this.client.guilds.cache.size}
      `)
      .setColor("RED")
      .setTimestamp();
    
    this.client.channels.cache.get("588670355653263371").send(leaveEmbed);
    await this.client.user.setActivity(`${this.client.guilds.cache.size} Servers | ${this.client.config.prefix}help`, { type: "WATCHING" });
  }
};