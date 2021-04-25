require("dotenv").config();
const fs = require("fs");
const Discord = require("discord.js");

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}

const TOKEN = process.env.TOKEN;
client.login(TOKEN);

client.on("ready", () => {
  console.info(`Logged in as ${client.user.tag}!`);
});

client.on("message", (msg) => {

  if (msg.guild === null) {
    return msg.reply("Hey there, no reason to DM me anything. I won't answer anyway :wink:");
  }

  const args = msg.content.split(/ +/);
  const command = args.shift().toLowerCase();
  console.info(`Called command: ${command}`);

  try {
    const commandToExecute = getCommandFromName(client.commands, command)

    if (commandToExecute) {
      //to add a mandatory argument, in the command set args: true
      if (commandToExecute.args && !args.length) {
        return msg.channel.send(
          `Questo comando ha bisogno di argomenti, ${msg.author}! Prova a scrivere \`!help ` + command + '`'
        );
      }

      commandToExecute.execute(msg, args);
    }
  } catch (error) {
    console.error(error);
    msg.reply("there was an error trying to execute that command!");
  }
});

function getCommandFromName(commands, name) {
  return (
    commands.get(name) ||
    commands.find((c) => c.aliases && c.aliases.includes(name))
  );
}
