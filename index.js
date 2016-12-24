'use strict';

const Alexa = require('alexa-sdk');
const AWS = require('aws-sdk');

const sqsOptions = {
    region: process.env.SQS_REGION,
    sslEnabled: true
};

const sqs = new AWS.SQS(sqsOptions);

const sqsUrlParams = {
    region: process.env.SQS_REGION,
    accountId: process.env.AWS_ACCOUNT_ID,
    queueName: process.env.SQS_COMMAND_QUEUE_NAME
};

const sqsUrl = `https://sqs.${sqsUrlParams.region}.amazonaws.com/${sqsUrlParams.accountId}/${sqsUrlParams.queueName}`;

function changeChannel(count, callback) {
    const command = {
        name: 'change-channel',
        count: count
    };

    const params = {
        MessageBody: JSON.stringify(command),
        QueueUrl: sqsUrl
    };

    sqs.sendMessage(params, (error, data) => {
        if (error) {
            callback(error);
        } else {
            callback(null, data.MessageId);
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
        changeChannel(1, (error, messageId) => {
            if (error) {
                console.error('Failed to change channel');
                console.error(error);

                this.emit(':tell', 'Something went wrong trying to change the channel.');
                return;
            }

            console.error(`Changed channel: ${messageId}`);
            this.emit(':tell', 'OK, channel up.');
        });
    },

    ChannelDownIntent: function () {
        changeChannel(-1, (error, messageId) => {
            if (error) {
                console.error('Failed to change channel');
                console.error(error);

                this.emit(':tell', 'Something went wrong trying to change the channel.');
                return;
            }

            console.error(`Changed channel: ${messageId}`);
            this.emit(':tell', 'OK, channel down.');
        });
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
