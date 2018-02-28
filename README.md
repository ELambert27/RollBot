# RollBot
Discord bot for rolling dice

Rollbot is a bot that generates random numbers to replicate rolling dice. With version 1.0, the system is going to generate D&D-style dice numbers (1d20, 2d6, etc), and should be able to read any kind of random number through the use of regular expressions (hopefully).

If you want to copy and use your own rollbot, copy the files, add a file called auth.json with the following text:
	{
		"token": "YOUR_TOKEN_HERE"
	}
I'd recommend also following the instructions at this link ( https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token ) to get starting with creating a bot account and running the bot.

npm install woor/discord.io#gateway_v6 --save