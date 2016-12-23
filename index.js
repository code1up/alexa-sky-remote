'use strict';

const Alexa = require('alexa-sdk');
const PubNub = require('pubnub');

const options = {
    publishKey: process.env.PN_PUBLISH_KEY,
    subscribeKey: process.env.PN_SUBSCRIBE_KEY,
    ssl: true
};

const pubnub = new PubNub(options);

function channelUp() {
    pubnub.publish(
        {
            message: {
                command: 'channelup'
            },
            channel: 'alexa-sky-remote',
            sendByPost: false,
            storeInHistory: false
        },
        (status, response) => {
            console.log(status);
            console.log(response);
        }
    );
}

const handlers = {
    LaunchRequest: function () {
        console.log(this);
        this.emit('AboutIntent');
    },

    AboutIntent: function () {
        this.emit(':tell', 'Welcome to Sky Remote for Amazon Echo.');
    },

    UpChannelIntent: function () {
        channelUp();
        this.emit(':tell', 'Channel up.');
    },

    DownChannelIntent: function () {
        this.emit(':tell', 'Channel down.');
    },

    Unhandled: function () {
        this.emit(':tell', 'Sorry, not sure what you said.');
    }
};

exports.handler = (event, context /*, callback */) => {
    const alexa = Alexa.handler(event, context);

    alexa.registerHandlers(handlers);
    alexa.execute();
};
