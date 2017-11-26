var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: bot.username');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '/') {
        var args = message.substring(1).split(' ');
        var cmd = message.substring(1, 5);
	var remainder = message.substring(5);
       
        args = args.splice(1);
        switch(cmd) {
            // /roll
            case 'roll':
		if (remainder.length > 0) {
			bot.sendMessage({
			    to: channelID,
			    message: "I can't do this yet"
			});
		}
		else { //remainder.length <= 0
			var randomNumber = Math.ceil(Math.random() * 20);
        	        bot.sendMessage({
        	            to: channelID,
                	    message: randomNumber
	                });
		}
                break;

         }
     }
});