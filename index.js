const TwitchClient = require('twitch').default
const HelixStream = require('twitch').HelixStream
const WebHookListener = require('twitch-webhooks').default
//const PubSubClient = require('twitch-pubsub-client').default
//const { PubSubChatMessage } = require('twitch-pubsub-client')

const { userId, clientId, secret } = require('./config')

const twitchClient = TwitchClient.withClientCredentials(clientId, secret)

/**
 * twitch (main)
 * https://d-fischer.github.io/twitch/
 */
async function isStreamLive(username) {
	const user = await twitchClient.helix.users.getUserByName(username)
	if (!user) return false
	const stream = await twitchClient.helix.streams.getStreamByUserId(user.id)
	return stream !== null
}

isStreamLive('travisk_streams')

/**
 * twitch-webhooks
 * https://d-fischer.github.io/twitch-webhooks/
 */

async function getSubscription() {
	const listener = await WebHookListener.create(twitchClient, {
		hostName: 'https://travisk.info/twitch-webhook',
		port: 8090,
		reverseProxy: { port: 443, ssl: true },
	})
	listener.listen()

	function onStreamChange(stream = HelixStream) {
		if (stream) {
			console.log('yay stream!')
			console.log(stream.userDisplayName, stream.title)
		} else {
			console.log('no stream...')
		}
	}
	return await listener.subscribeToStreamChanges(userId, onStreamChange)
}

const subscription = getSubscription()

process.on('SIGINT', () => {
	subscription.stop()
	process.exit(0)
})

/**
 * twitch-pubsub-client
 * https://d-fischer.github.io/twitch-pubsub-client/
 */

//const pubSubClient = new PubSubClient()
//await pubSubClient.registerUserListener(twitchClient)
// waiting on response from discord channel for how to use
// pub sub with chat messages and/or follows
// https://discordapp.com/channels/325552783787032576/350012219003764748/686454266860142615
// RESPONSE: https://discordapp.com/channels/325552783787032576/350012219003764748/686459560617443378
// webhooks are the only option for follows, irc for chat

// message eiymba github repo
