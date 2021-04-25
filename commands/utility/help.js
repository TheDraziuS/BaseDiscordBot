const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "!help",
  aliases: ["!comandi", "!aiuto"],
  usage: "[nome comando]",
  cooldown: 5,
  description: "La lista di tutti i comandi",
  execute(msg, args) {
    const prefix = "!";
    let data = [];
    const commandsToNotShow = [];
    const { commands } = msg.client;

    if (!args.length) {
      data = commands.map((command) => ({
        name: command.name,
        value: command.description,
      }));

      data = data.filter(function (value) {
        return !commandsToNotShow.includes(value.name);
      });
      const embed = new MessageEmbed()
        .setTitle(`Lista comandi`)
        .setDescription(
          `\nPuoi scrivere \`${prefix}help [comando]\` per avere informazioni più specifiche!`
        )
        .setColor(5814783)
        .setThumbnail("")
        .addFields(data);
      return msg.channel.send(embed).catch((error) => {
        console.error(`Could not answer to ${msg.author.tag}.\n`, error);
        msg.reply("Qualcosa non va, non posso risponderti :( ");
      });
    }

    const name = args[0].toLowerCase();
    
    const command = getCommandFromName(commands, name);

    if (!command) {
      return msg.reply("questo comando non esiste!");
    }

    data.push({
      name: "Nome",
      value: command.name,
    });

    if (command.aliases) {
      data.push({
        name: "Aliases",
        value: command.aliases.join(", "),
      });
    }
    if (command.description) {
      data.push({
        name: "Descrizione",
        value: command.description,
      });
    }
    if (command.usage) {
      data.push({
        name: "Uso",
        value: command.usage,
      });
    }
    if (command.cooldown) {
      data.push({
        name: "Cooldown",
        value: `${command.cooldown} secondi`,
      });
    }

    const embed = new MessageEmbed()
      .setTitle(`Spiegazione comando ${args[0]}`)
      .setColor(5814783)
      .setThumbnail("")
      .addFields(data);
    msg.channel.send(embed);
  },
};
function getCommandFromName(commands, name) {
  return (
    commands.get(name) ||
    commands.find((c) => c.aliases && c.aliases.includes(name))
  );
}
