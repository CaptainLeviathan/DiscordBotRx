const Discord = require('discord.js');
const client = new Discord.Client();
const operator = '~';

var root = initCommand(root);
root.command = function () {
	return 'No cammand say some thing';
};

root.error = function () {
	return 'No cammand say some thing';
};

//root sub commands
//	hiThere command
root.subCommands.hiThere = initCommand(root.subCommands.hiThere);
root.subCommands.hiThere.command = function (pMsg, layer) {
	return 'hi there' + pMsg.msg.author;
};

//	hiThere command
root.subCommands.help = initCommand(root.subCommands.help);
root.subCommands.help.command = function (pMsg, layer) {
	return 'shit out of luck';
};

//implementation
function isCommand (msg) {
	return msg.content.startsWith(operator);
}

function parseCammands (msg) {
	return {'commands': msg.content.toLowerCase().slice(1).split(' '), 'msg': msg};
}

function initCommand (base) {
	base = {};
	base.command = {};
	base.subCommands = {};
	base.error = {};
	return base;
}

function nxtLayerTree (pMsg, base, layer)
{
		if(layer >= pMsg.commands.length)
		{
			return base.command(pMsg);
		}
		else
		{
			let subCommandKeys = Object.keys(base.subCommands);
			for (var i = 0; i < subCommandKeys.length; i++) {
				console.log('command to check: ' + pMsg.commands[layer]);
				console.log('subCommand ceck: ' + subCommandKeys[i]);
				if (subCommandKeys[i] === pMsg.commands[layer]) {
					return nxtLayerTree(pMsg, base.subCommands[subCommandKeys[i]], layer + 1);
				}
			}
			return base.error();
		}
}

client.on('ready', () => {
	console.log('the bot is online');
});

client.on('message', message => {
	if(isCommand(message)) {
		message.reply (nxtLayerTree(parseCammands(message), root, 0));
	}
});

client.login('MzA1MTU4MDcxNTg2NTIxMDk4.C9ySiA.1We6bHxz5Vrhid2j8ZFrxtpI-WM');
