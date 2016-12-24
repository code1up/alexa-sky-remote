'use strict';

const Alexa = require('alexa-sdk');
const AWS = require('aws-sdk');

const sqsOptions = {
    region: process.env.SQS_REGION,
    accessKeyId: process.env.SQS_ACCESS_KEY_ID,
    secretAccessKey: process.env.SQS_SECRET_ACCESS_KEY,
    sslEnabled: true
};

const sqs = new AWS.SQS(sqsOptions);

const sqsUrlParams = {
    region: process.env.SQS_REGION,
    accountId: process.env.AWS_ACCOUNT_ID,
    queueName: process.env.SQS_COMMAND_QUEUE_NAME
};

const sqsUrl = `https://sqs.${sqsUrlParams.region}.amazonaws.com/${sqsUrlParams.accountId}/${sqsUrlParams.queueName}`;

function channelUp(/* callback */) {
    const command = {
        name: 'change-channel',
        count: 1
    };

    const params = {
        MessageBody: JSON.stringify(command),
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

    ChannelUpIntent: function () {
        channelUp();
        this.emit(':tell', 'Channel up.');
    },

    ChannelDownIntent: function () {
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
