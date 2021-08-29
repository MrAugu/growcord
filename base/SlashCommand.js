class SlashCommand {
    constructor (client, {
      name = null,
      description = "No description has been provided.",
      category = "None",
      enabled = true,
      guildOnly = false,
      permLevel = "User",
      options = new Array()
    }) {
      this.client = client;
      this.conf = { enabled, guildOnly, permLevel };
      this.help = { name, description, options, category };
    }
  }
    
module.exports = SlashCommand;