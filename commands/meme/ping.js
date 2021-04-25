module.exports = {
  name: '!ping',
  description: 'Risponde pong',
  usage: "",
  execute(msg, args) {
    msg.reply('pong');
  },
};
