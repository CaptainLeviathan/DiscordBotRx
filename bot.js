const Discord = require('discord.js');
const client = new Discord.Client();
const setting = require('./settings.js').settings;

const operator = setting.operator;
const stringNote = setting.stringNote;
const defaltPerm = setting.defaltPerm;
const token = setting.token;
const adminID = setting.adminID;

var root = initCommand(root);
root.perms = {};
root.perms[adminID] = 0;
root.func = function () {
	return 'No cammand say some thing';
};

// root sub commands
//	hiThere command
root.subCommands.hiThere = initCommand(root.subCommands.hiThere);
root.subCommands.hiThere.func = function (pMsg, args) {
	return 'hi there' + pMsg.msg.author;
};
//		hayThere command
root.subCommands.hiThere.subCommands.hayThere = initCommand(root.subCommands.hiThere.subCommands.hayThere);
root.subCommands.hiThere.subCommands.hayThere.func = function (pMsg, args) {
	return 'test';
};
//	perms command
root.subCommands.perms = initCommand(root.subCommands.perms);
root.subCommands.perms.func = function (pMsg, args) {
	return 'get and set premsissions';
};

root.subCommands.perms.subCommands.Command = initCommand(root.subCommands.perms.subCommands.Command);
root.subCommands.perms.subCommands.Command.func = function (pMsg, args) {
	return 'add get or set';
};

root.subCommands.perms.subCommands.Command.subCommands.get = initCommand(root.subCommands.perms.subCommands.Command.subCommands.get);
root.subCommands.perms.subCommands.Command.subCommands.get.func = function (pMsg, args) {
	return args + ' permission level is : ' + getCommand('args').perm;
};

// not working FIX THIS
root.subCommands.perms.subCommands.Command.subCommands.set = initCommand(root.subCommands.perms.subCommands.Command.subCommands.set);
root.subCommands.perms.subCommands.Command.subCommands.set.func = function (pMsg, args) {

};

root.subCommands.perms.subCommands.User = initCommand(root.subCommands.perms.subCommands.User);
root.subCommands.perms.subCommands.User.func = function (pMsg, args) {
	return 'get and set User premsissions';
};

root.subCommands.perms.subCommands.User.subCommands.get = initCommand(root.subCommands.perms.subCommands.User.subCommands.get);
root.subCommands.perms.subCommands.User.subCommands.get.func = function (pMsg, args) {
	if (root.perms[args] === null || root.perms[args] === undefined) {
		return 'Must be vailid User ID';
	}
	else {
		return 'User with id ' + args + ' premsissions are : ' + root.perms[args];
	}
};

root.subCommands.perms.subCommands.User.subCommands.set = initCommand(root.subCommands.perms.subCommands.User.subCommands.set);
root.subCommands.perms.subCommands.User.subCommands.set.func = function (pMsg, args) {
	var authorId = pMsg.msg.author.id;
	if (root.perms[args[0]] === null || root.perms[args[0]] === undefined) {
		return 'User must have called at least one bot command beffore you can change the permissions Or use User ID';
	}
	if (root.perms[authorId] < root.perms[args[0]] && root.perms[authorId] < args[1] && args[1] >= 0) {
		root.perms[args[0]] = args[1];
		return args[0] + ' premsissions now set to : ' + args[1];
	}
	else {
		return 'you do not have premsission to do that!!!';
	}
};

//	help acseses the command tree and prints out the description of a command and any of its subCommands
root.subCommands.help = initCommand(root.subCommands.help);
root.subCommands.help.func = function (pMsg, args) {
	if (args === undefined) {
		args = '';
	}
	var man = '';
	var command = getCommand(args);
	let subCommandKeys = Object.keys(command.subCommands);
	man += '\n**' + args + '**: ' + command.description + '\n';
	for (var i = 0; i < subCommandKeys.length; i++) {
		man += '	**' + subCommandKeys[i] + '**: ' + command.subCommands[subCommandKeys[i]].description + '\n';
	}
	return man;
};

// ecco func
root.subCommands.ecco = initCommand(root.subCommands.ecco);
root.subCommands.ecco.func = function (pMsg, args)	{
	return args.toString();
};

// implementation
// helper fuction for command creation
function initCommand (base) {
	base = {};
	base.func = {};
	base.subCommands = {};
	base.description = 'no description';
	base.perm = 0;
	base.args = ['any'];
	return base;
}

// checks if message is command
function isCommand (msg) {
	return msg.content.startsWith(operator);
}

// brakes apart command and out puts array + original(pMsg or parsed messege) command Object.
// LongArg for when you whant a text input to a command and should not be used for commands with spaces.
// LongArg should always be the last things in your command
function parseContent (msg) {
	let content = msg.content.slice(1);
	let parsedContent = [];
	var indexOfOpen = -1;
	var indexOfStringOpen = -1;
	var inString = false;
	for (var i = 0; i < content.length; i++) {
		if (content[i] === stringNote) {
			if (inString) {
				parsedContent.push(content.slice(indexOfStringOpen + 1, i));
				inString = false;
			}
			else {
				indexOfStringOpen = i;
				inString = true;
			}
		}
		if (content[i] === ' ' && !inString) {
			if (indexOfStringOpen <= indexOfOpen) {
				let arg = content.toLowerCase().slice(indexOfOpen + 1, i);
				if (isNaN(arg)) {
					parsedContent.push(arg);
				}
				else {
					parsedContent.push(parseInt(arg));
				}
			}
			indexOfOpen = i;
		}
	}
	if (indexOfStringOpen <= indexOfOpen) {
		let arg = content.toLowerCase().slice(indexOfOpen + 1, i);
		if (isNaN(arg)) {
			parsedContent.push(arg);
		}
		else {
			parsedContent.push(parseInt(arg));
		}
	}
	console.log('contents: ' + parsedContent);
	return { 'contents': parsedContent, 'msg': msg };
}

// Checks if permissions are ok and if args match what is expected for the command.
function callCommand (pMsg) {
	let commandArgs = contentsToCommandArgs(pMsg.contents);
	let perm = root.perms[pMsg.msg.author.id];
	if (perm === undefined || perm === null) {
		root.perms[pMsg.msg.author.id] = defaltPerm;
		perm = defaltPerm;
	}
	if (root.perms[pMsg.msg.author.id] <= commandArgs.command.perm) {
		if (commandArgs.command.args[0] === 'any' || commandArgs.command.args === null || commandArgs.command.args === undefined) {
			return commandArgs.command.func(pMsg, commandArgs.args);
		} else if (commandArgs.command.args[0] === 'none' && (commandArgs.args === null || commandArgs.args === undefined)) {
			return commandArgs.command.func(pMsg, commandArgs.args);
		} else if (commandArgs.args.length === commandArgs.command.args.length) {
			for (var i = 0; i < commandArgs.args.length; i++) {
				if (typeof commandArgs.args[i] !== commandArgs.command.args[i]) {
					console.log(typeof commandArgs.args[i], commandArgs.command.args[i]);
					return 'this command takes argumts: ' + commandArgs.command.args;
				}
			}
			return commandArgs.command.func(pMsg, commandArgs.args);
		}
		else {
			return 'this command takes argumts: ' + commandArgs.command.args;
		}
	}
	else {
		return 'you require at least permission level ' + commandArgs.command.perm + ' to run this command';
	}
}

function getCommand (contents) {
	return contentsToCommandArgs(contents).command;
}

function contentsToCommandArgs (contents) {
	return commandTreeRecursiveSearch(contents, root, 0);
}

/*
Gose throuh a command tree based on a parsed command input a base command object to start with.
A command tree object should look like this.

root
----func //this is the implementation of that command
----subCommands //any subCommands that might fall under a command with be called like (~foo bar) bar being a subcommand of foo
--------foo
------------func
------------subCommands
----------------bar
ect...
*/

function commandTreeRecursiveSearch (contents, base, layer) {
	var args = [];
	if (contents === null || contents === undefined) {
		return { 'command': base, 'args': args };
	}
	if (layer >= contents.length) {
		return { 'command': base, 'args': args };
	}
	else {
		let subCommandKeys = Object.keys(base.subCommands);
		for (var i = 0; i < subCommandKeys.length; i++) {
			if (subCommandKeys[i].toLowerCase() === contents[layer]) {
				return commandTreeRecursiveSearch(contents, base.subCommands[subCommandKeys[i]], layer + 1);
			}
		}
		args = contents.slice(layer);
		return { 'command': base, 'args': args };
	}
}

client.on('ready', () => {
	console.log('the bot is online');
});

client.on('message', message => {
	if (isCommand(message)) {
		message.reply(callCommand(parseContent(message)));
	}
});

client.login(token);
