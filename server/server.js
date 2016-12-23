const PubNub = require('pubnub');
const eyes = require('eyes');

const options = {
    publishKey: process.env.PN_PUBLISH_KEY,
    subscribeKey: process.env.PN_SUBSCRIBE_KEY,
    ssl: true
};

const pubnub = new PubNub(options);

eyes.inspect(options);

pubnub.addListener({
    message: message => {
        eyes.inspect(message);
    },
    status: status => {
        eyes.inspect(status);
    }
});

pubnub.subscribe({
    channels: [
        'alexa-sky-remote'
    ]
});

pubnub.publish(
    {
        message: {
            such: 'object'
        },
        channel: 'alexa-sky-remote',
        sendByPost: false,
        storeInHistory: false
    },
    (status, response) => {
        eyes.inspect(status);
        eyes.inspect(response);
    }
);
