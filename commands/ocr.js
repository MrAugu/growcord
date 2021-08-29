const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");
const fetch = require("node-fetch");

class OCR extends Command {
  constructor (client) {
    super(client, {
      name: "ocr",
      description: "Extract **ENGLISH** text from a photo.",
      category: "Tools",
      usage: "",
      enabled: true,
      guildOnly: true,
      aliases: [],
      permLevel: "User",
      cooldown: 5,
      args: false
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
      if (!message.attachments.first()) return reply("You need to specify an image.");
      const key = "edb77f608988957";
      const ImageUrl = message.attachments.first().url;
      const requestURL = `https://api.ocr.space/parse/imageurl?apikey=${key}&url=${ImageUrl}`;

      const ocrOutput = await fetch(requestURL).then(r => r.json());
      console.log(ocrOutput);
      if (!ocrOutput.ParsedResults[0]) return reply("OCR faieled.");
      if (ocrOutput.ParsedResults[0].ErrorMessage) return repy(`OCR failed: ${ocrOutput.ParsedText[0].ErrorMessage}\n> ${ocrOutput.ParsedText[0].ErrorDetails}`);
      var text = ocrOutput.ParsedResults[0].ParsedText;
      text = text.replace(/\r\n/g, " ");
      text = text.replace(/\*/, "\*");

      reply(`:white_check_mark: Done! Took \`${ocrOutput.ProcessingTimeInMilliseconds}ms\` to extract the text.\n> ${text}`);
    }
  }

module.exports = OCR;
