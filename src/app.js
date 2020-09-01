import tmi from 'tmi.js'
import { CHANNEL_NAME, OAUTH_TOKEN, BOT_USERNAME, BLOCKED_WORDS } from './constants';


const options = {
    options: { debug: true },
	connection: {
		reconnect: true,
		secure: true
	},
	identity: {
		username: BOT_USERNAME,
		password: OAUTH_TOKEN
	},
	channels: [ CHANNEL_NAME ]
}

const client = new tmi.Client(options);

client.connect().catch(console.error);

client.on('message', (channel, userstate, message, self) => {

    if(self) return;
    //if(userstate.username === BOT_USERNAME) return;
    //client.say(channel, 'test123');
	if(message.toLowerCase() === '!hello') {
		client.say(channel, `@${userstate.username}, heya!`);
    }
    
    checkTwitchChat(userstate, message, channel);

});


function checkTwitchChat(userstate, message, channel) {

    let shouldSendMessage = false;

    shouldSendMessage = BLOCKED_WORDS.some(blockedWord => message.includes(blockedWord.toLowerCase()));


    if(shouldSendMessage){

        client.say(channel, `Sorry @${userstate.username}! You're message was deleted.`);

        client.deletemessage(channel, userstate.id );

    }

    
    

}