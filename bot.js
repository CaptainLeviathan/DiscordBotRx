const Discord = require('discord.js');
const client = new Discord.Client();
const operator = "~";

function functionName(fun)
{
  var ret = fun.toString();
  ret = ret.substr('function '.length);
  ret = ret.substr(0, ret.indexOf('('));
  ret = ret.toString();
  return ret;
}

function isCommand(msg)
{
   return msg.content.startsWith(operator);
}

function brakeUp(msg)
{
  return {
      'commands' : msg.content.toLowerCase().slice(1).split(" "),
      'obj' : msg
  };
}

function caller(msg,c,layer)
{
  if(msg.commands.length - 1 < layer)
  {
    return c.defalt();
  }
  try
  {
    return c.commands[msg.commands[i]](msg, layer + 1);
  }
  catch (e)
  {
    c.error();
  }
}


client.on('ready', () => {
  console.log('the bot is online');
});

client.on('message', message => {
    if (isCommand(message))
    {
          message.reply(root(brakeUp(message)));
    }
});


function root (msg) {
  let c = {};

  return caller(msg, c, 0);

  c.commands.hiThere = function (msg, layer) {
    return 'hi there' + msg.obj.author;
  };

  c.commands.help = function (msg, layer) {
    return 'shit out of luck';
  };

  c.defalt = function noCammand () {
    return 'NoCammand say some thing';
  };

  c.error = function () {
    return 'NoCammand say some thing';
  };
}



client.login('MzA1MTU4MDcxNTg2NTIxMDk4.C9xYTA.VK0hUjgPlBzXFs5ujNoHkUd_XSg');
