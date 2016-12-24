const AWS = require('aws-sdk');
const inspect = require('eyes').inspector();
const SkyRemote = require('sky-remote');

const skyRemote = new SkyRemote(process.env.SKY_BOX_IP_ADDRESS);

const sqsOptions = {
    region: process.env.SQS_REGION,
    sslEnabled: true
};

const client = new AWS.SQS(sqsOptions);

const sqsUrlParams = {
    region: process.env.SQS_REGION,
    accountId: process.env.AWS_ACCOUNT_ID,
    queueName: process.env.SQS_COMMAND_QUEUE_NAME
};

const sqsUrl = `https://sqs.${sqsUrlParams.region}.amazonaws.com/${sqsUrlParams.accountId}/${sqsUrlParams.queueName}`;

const options = {
    QueueUrl: sqsUrl,
    MaxNumberOfMessages: 1,
    VisibilityTimeout: 3,
    WaitTimeSeconds: 20
};

handleCommands();

function handleCommands() {
    console.log('Waiting...');

    client.receiveMessage(options, (error, data) => {
        if (error) {
            inspect(error);
            return;
        }

        if (data.Messages) {
            const message = data.Messages[0];
            const command = JSON.parse(message.Body);

            inspect(command);
            inspect(message);

            removeMessage(message);

            if (command.name === 'change-channel') {
                const button = command.count === 1 ?
                    'channelup' : 'channeldown';

                skyRemote.press(button);

            } else if (command.name === 'set-channel') {
                const numbers = command.channel.replace(/[0-9]/g, '$& ').trim();

                inspect(numbers);

                skyRemote.press(numbers);
            }
        }

        handleCommands();
    });
}

function removeMessage(message) {
    const options = {
        QueueUrl: sqsUrl,
        ReceiptHandle: message.ReceiptHandle
    };

    const handler = (error, data) => {
        if (error) {
            inspect(error);
            return;
        }

        inspect(data);
    };

    client.deleteMessage(options, handler);
}
