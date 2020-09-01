import tmi from 'tmi.js'
import { CHANNEL_NAME, OAUTH_TOKEN, BOT_USERNAME, BLOCKED_WORDS } from './constants';
import axios from 'axios';


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

//const client = new tmi.Client(options);
const twitchClient = new tmi.Client(options);

twitchClient.connect().catch(console.error);

twitchClient.on('message', async (channel, userstate, message, self) => {


    const params = message.split(" ");

    if(self) return;
    //if(userstate.username === BOT_USERNAME) return;
	if(params[0].toLowerCase() === '!hello') {
		twitchClient.say(channel, `@${userstate.username}, heya!`);
    }
    if(params[0].toLowerCase() === '!queue'){

        // COMMAND: "!queue" returns the current artist
        if(params.length===1){
            
            const result = await axios.get('http://localhost:3001/current');
            twitchClient.say(channel, `The next person in queue is: ${result.data.artist}`);
        }
        else{  // COMMAND: "!queue <link>" adds the artist and song link to the queue

            axios({
                method: 'post',
                url: 'http://localhost:3001/queue',
                data: {
                    artist: userstate.username,
                    link: params[1]
                }
            });

            twitchClient.say(channel, `@${userstate.username}, your song has been submitted to the queue!`);
        }
            
    }
    
    checkTwitchChat(userstate, message, channel);

});


function checkTwitchChat(userstate, message, channel) {

    let shouldSendMessage = false;

    shouldSendMessage = BLOCKED_WORDS.some(blockedWord => message.includes(blockedWord.toLowerCase()));


    if(shouldSendMessage){

        twitchClient.say(channel, `Sorry @${userstate.username}! You're message was deleted.`);

        twitchClient.deletemessage(channel, userstate.id );

    }

    
    

}