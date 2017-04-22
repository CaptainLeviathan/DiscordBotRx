const Discord = require('discord.js');
const client = new Discord.Client();
const operator = '~';

var root = {};

function BaseCommand (msg) {
  root.commands.hiThere = function (msg, layer) {
    return 'hi there' + msg.obj.author;
  };

  root.commands.help = function (msg, layer) {
    return 'shit out of luck';
  };

  root.defalt = function () {
    return 'NoCammand say some thing';
  };

  root.error = function () {
    return 'NoCammand say some thing';
  };
  nxtLayerTree(msg, root, 0);
}

function isCommand (msg) {
   return msg.content.startsWith(operator);
}

function parseCammands (msg) {
  return {
      'commands': msg.content.toLowerCase().slice(1).split(' '),
      'obj' : msg
  };
}

function nxtLayerTree (msg, base, layer)
{
  if(msg.commands.length - 1 < layer)
  {
    return base.defalt();
  }
  try
  {
    return base.commands[msg.commands[layer]](msg, layer + 1);
  }
  catch (e)
  {
    base.error();
  }
}


client.on('ready', () => {
  console.log('the bot is online');
});

client.on('message', message => {
    if (isCommand(message))
    {
          message.reply(BaseCommand(parseCammands(message)));
    }
});

client.login('token');
