'use strict';

const Alexa = require('alexa-sdk');
const AWS = require('aws-sdk');

const sqsOptions = {
    region: 'us-east-1'
};

const sqs = new AWS.SQS(sqsOptions);

const awsAccountId = process.env.AWS_ACCOUNT_ID;
const sqsUrl = `https://sqs.us-east-1.amazonaws.com/${awsAccountId}/alexa-sky-remote`;

function channelUp(/* callback */) {
    var params = {
        MessageBody: {
            command: 'channelup'
        },
        QueueUrl: sqsUrl
    };

    sqs.sendMessage(params, (err, data) => {
        if (err) {
            console.log('error:', 'Fail Send Message' + err);
            // this.context.done('error', 'ERROR Put SQS');
        } else {
            console.log('data:', data.MessageId);
            // this.context.done(null, '');
        }
    });
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
