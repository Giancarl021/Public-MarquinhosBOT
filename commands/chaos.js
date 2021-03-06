const fileEdit = require("./../utils/fileEdit");
module.exports = {
	name: 'chaos',
	description: 'Instaura o CHAOS nos canais de voz',
	execute(message, args) {
        let num;
        if(typeof args[0] !== "number"){
            num = 10;
        }
        else{
            num = args[0];
        }
        // This just gets the voice channel that the user called;
        var voiceChannel = message.member.voice.channel
        isReady = fileEdit.read("isReady");
        if(isReady && voiceChannel){
            fileEdit.edit("isReady", false);
            // Play song method
            voiceChannel.join().then(connection => {
                const dispatcher = connection.play('./resources/sounds/caos.mp3');
                dispatcher.on('finish', end => {
                    voiceChannel.leave();
                    chaos2(message, num);
                });
            }).catch(err => console.log(err));
            fileEdit.edit("isReady", true);
        }
        else {
            // If the person isn't inside a voice channel
            message.channel.send('Você não está num canal de voz!');
        }
    },
};

async function chaos2(message, num){
    //Why do I have to do a try/catch just to delete a message? Dunno >:
    try {
        message.delete();   
    } catch (error) {
        console.log(error);
    }
    //Gets the voice channel that will (primaly) suffer the chaos
    voiceChannel = message.member.voice.channel;
    //Gets the list of all voice channels in the guild
    const voiceChannels = message.guild.channels.cache.filter(c => c.type === 'voice');
    //Gets the list of all users in the voiceChannel
    activeUsers = voiceChannel.members.filter(user => !user.user.bot);
    //Gets the channel that the CHAOS started
    // msgChannel = message.channel;
    //Finally, calls the function chaos3, that will move people around and create REAL chaos
    counter = 0;
    chaos3(counter, voiceChannel, voiceChannels, activeUsers, num);
 }

async function chaos3(counter, voiceChannel, voiceChannels, activeUsers, num){
    // That's how I made it work. Recursively calling the function chaos with a counter that goes from 1 to 10.
    if(counter < num){
        setTimeout(function() {
            // First, increment the counter to the next call
            counter++;
            // Here, goes the code to randomly switch channels
            randomKey = activeUsers.randomKey();
            usuario = activeUsers.get(randomKey);
            usuario.voice.setChannel(voiceChannels.randomKey());
            // Check if the user disconnected from a voice channel during the recursivity 
            if(usuario.voice.channel){
                console.log(`${usuario.voice.channel}`);
                // There's the recursivity
                try {
                    chaos3(counter, voiceChannel, voiceChannels, activeUsers, num);
                } catch (error) {
                    console.log('erro!');
                }
            }
        }, 1500);
    }else{
        // For sure I can improve that.
        usersArray = activeUsers.firstKey(activeUsers.array().length);
        // The last iteration that runs ALL the active users array, sending them to the original channel.
        for(x = 0; x < usersArray.length; x++){
            usuario = activeUsers.get(usersArray[x]);
            // Console.log('Deslocando ' + usuario.username + ' para o canal ' + voiceChannel.name + '.');
            usuario.voice.setChannel(voiceChannel.id.toString());     
        }
    }
}