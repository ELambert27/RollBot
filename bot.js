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
    // It will listen for messages that will start with `/`
    if (message.substring(0, 1) == '/') {
        var args = message.substring(1).split(' ');
        var cmd = message.substring(1, 5);
	var remainder = message.substring(5);
        args = args.splice(1);
       
	switch(cmd) {
            // /roll
            case 'roll':
		var error = false;	//represents whether we've come across an error in our processing of the file so far
		if (remainder.length > 0) {
			//first, interpret what the message is saying
			var roll = 0;		//the numerical result of the dice being rolled
			var message = 'math: ';	//a representation of the final message to print
			var badInput = false; 	//becomes true in the case of unrecognized inputs
			var negation = false; 	//represents whether what we're bringing in next should be subtracted from the result

			while(remainder.length > 0) {
				var beginning = remainder.substring(0, 1);
				switch(beginning){
					//space -- ignore
					case(' '):
						remainder = remainder.substring(1);
						break;

					//numericals
					case('1'): case('2'): case('3'): case('4'): case('5'):
					case('6'): case('7'): case('8'): case('9'): case('0'):
						//do stuff -- either return the number or roll that many dice if d||D follows this
						var number = remainder.match(/[1234567890]+/); //regular expression
						remainder = remainder.substring(number[0].length);
						if(remainder.length > 0 && (remainder.substring(0, 1) == 'd' || remainder.substring(0, 1) == 'D'))
						{
							var dieSize = remainder.substring(1).match(/[1234567890]+/);
							remainder = remainder.substring(dieSize[0].length + 2);
							dieSize = parseInt(dieSize);
							number = parseInt(number);
							while(number > 0)
							{
								if(negation) {
									var temp = Math.ceil(Math.random() * dieSize);
									roll = roll - temp;
									message = message + " - " + temp;
								}
								else {
									var temp = Math.ceil(Math.random() * dieSize);
									roll = roll + temp;
									message = message + " + " + temp;
								}
								number = number - 1;
							}
						}
						else //remainder.substring(0,1) != 'd' or 'D'
						{
							if(negation) {
								roll = roll - parseInt(number);
								message = message + " - " + number;
							}
							else {
								roll = roll + parseInt(number);
								message = message + " + " + number;
							}
						}
						break;

					//dice / disadvantage dice
					case('d'): case('D'):
						//do stuff -- roll one of the die number after this expression
						//or roll disadvantage d20 if the char after this is also d or D
						remainder = remainder.substring(1);
						if(remainder.substring(0, 1) == ' ' || remainder.length == 0)	
						{
							remainder = remainder.substring(2);
							var dieSize = 20;
							var roll1 = Math.ceil(Math.random() * dieSize);
							var roll2 = Math.ceil(Math.random() * dieSize);
							bot.sendMessage({
        	            					to: channelID,
                	    					message: "(with disadvantage)"
						                });
							var temp = Math.min(roll1, roll2);
							if(negation) {
								roll = roll - temp;
								message = message + " - " + temp;
							}
							else {
								roll = roll + temp;
								message = message + " + " + temp;
							}
						}
						else if(remainder.substring(0, 1) == 'd' || remainder.substring(0, 1) == 'D')
						{
							if(!remainder.substring(1,2).match(/[1234567890]/)) //sanitize against non-numerical followups 
							{
								var ddletteroutput = "incorrect input: d" + remainder.substring(0);
								bot.sendMessage({
									to: channelID,
									message: ddletteroutput
								});
								error = true;
								remainder = remainder.substring(1);
							}
							else
							{
								var dieSize = remainder.substring(1).match(/[1234567890]+/);
								remainder = remainder.substring(dieSize[0].length + 2);
								dieSize = parseInt(dieSize);
								var roll1 = Math.ceil(Math.random() * dieSize);
								var roll2 = Math.ceil(Math.random() * dieSize);
								bot.sendMessage({
        	            						to: channelID,
                	    						message: "(rolling disadvantage)"
						                	});
								var temp = Math.min(roll1, roll2);
								if(negation) {
									roll = roll - temp;
									message = message + " - " + temp;
								}
								else {
									roll = roll + temp;
									message = message + " + " + temp;
								}
							}
						}
						else //remainder.substring(0,1) != 'd' or 'D' or ' ', so it should be a number hopefully
						{
							if(!remainder.substring(0,1).match(/[1234567890]/)) //sanitize against non-numerical followups 
							{
								var dletteroutput = "incorrect input: d" + remainder.substring(0);
								bot.sendMessage({
									to: channelID,
									message: dletteroutput
								});
								error = true;
								remainder = remainder.substring(1);
							}
							else
							{
								var dieSize = remainder.match(/[1234567890]+/);
								remainder = remainder.substring(dieSize[0].length + 1);
								dieSize = parseInt(dieSize);
								var tempRoll = Math.ceil(Math.random() * dieSize);
								if(negation) {
									roll = roll - tempRoll;
									message = message + " - " + tempRoll;
								}
								else {
									roll = roll + tempRoll;
									message = message + " + " + tempRoll;
								}
							}
						}
						break;

					//advantage dice
					case('a'): case('A'):
						//roll advantage d20 if the char after this is a d or D
						remainder = remainder.substring(1);
						if(remainder.substring(0, 1) == ' ' || remainder.length == 0)	
						{
							remainder = remainder.substring(2);
							var dieSize = 20;
							var roll1 = Math.ceil(Math.random() * dieSize);
							var roll2 = Math.ceil(Math.random() * dieSize);
							bot.sendMessage({
        	            					to: channelID,
                	    					message: "(with advantage)"
						                });
							var temp = Math.max(roll1, roll2);
							if(negation) {
								roll = roll - temp;
								message = message + " - " + temp;
							}
							else {
								roll = roll + temp;
								message = message + " + " + temp;
							}
						}
						else if(remainder.substring(0, 1) == 'd' || remainder.substring(0, 1) == 'D')
						{
							if(!remainder.substring(0,1).match(/[1234567890]/)) //sanitize against non-numerical followups 
							{
								var adletteroutput = "incorrect input: a" + remainder.substring(0);
								bot.sendMessage({
									to: channelID,
									message: adletteroutput
								});
								error = true;
								remainder = remainder.substring(1);
							}
							else
							{
								var dieSize = remainder.substring(1).match(/[1234567890]+/);
								remainder = remainder.substring(dieSize[0].length + 2);
								dieSize = parseInt(dieSize);
								var roll1 = Math.ceil(Math.random() * dieSize);
								var roll2 = Math.ceil(Math.random() * dieSize);
								bot.sendMessage({
        	            						to: channelID,
                	    						message: "(rolling advantage)"
						                	});
								var temp = Math.max(roll1, roll2);
								if(negation) {
									roll = roll - temp;
									message = message + " - " + temp;
								}
								else {
									roll = roll + temp;
									message = message + " + " + temp;
								}
							}
						}
						break;
					//FATE dice
					case('f'): case('F'):
						//check that the rest of the expression is "ATE", then roll 4 fate dice
						//if the rest of the expression is a number, roll that many fate dice instead
						remainder = remainder.substring(1);
						if(remainder.length >= 3 && remainder.substring(0, 3).toUpperCase() == "ATE")
						{
							remainder = remainder.substring(3);
							if(/[1234567890]/.test(remainder.substring(0,1)))
							{
								//roll that many FATE dice
								var numberOfDice = remainder.match(/[1234567890]/);
								remainder = remainder.substring(numberOfDice[0].length);
								numberOfDice = parseInt(numberOfDice);
								for(i = 0; i < numberOfDice; i++)
								{
									var tempRoll = Math.ceil(Math.random() * 3) - 2;
									roll = roll + tempRoll;
									if(tempRoll < 0)
									{
										message = message + " - " + (-tempRoll);
									}
									else //tempRoll >= 0
									{
										message = message + " + " + tempRoll;
									}
								}
							}
							else //remainder[0] != 1-0
							{
								//roll the standard 4 FATE dice
								for(i = 0; i < 4; i++)
								{
									var tempRoll = Math.ceil(Math.random() * 3) - 2;
									roll = roll + tempRoll;
									if(tempRoll < 0)
									{
										message = message + " - " + (-tempRoll);
									}
									else //tempRoll >= 0
									{
										message = message + " + " + tempRoll;
									}
								}
							}
						}
						break;
					case('+'):
						remainder = remainder.substring(1);
						negation = false;
						break;
					case('-'):
						remainder = remainder.substring(1);
						negation = true;
						break;
					default: 
						bot.sendMessage({
							to: channelID,
							message: "There was a problem reading your input"
						});
						remainder = '';
						break;
				}
			}

			//then, we do it
			if(!error)
			{
				bot.sendMessage({
				    to: channelID,
				    message: roll + " -- " + message 	
				});
			}
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