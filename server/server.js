const AWS = require('aws-sdk');
const eyes = require('eyes');

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
    VisibilityTimeout: 5,
    WaitTimeSeconds: 3
};

client.receiveMessage(options, (error, data) => {
    if (error) {
        console.error(error);
        return;
    }

    if (data.Messages) {
        const message = data.Messages[0];
        const body = JSON.parse(message.Body);

        eyes.inspect(body);
        eyes.inspect(message);

        removeMessage(message);
    }
});

function removeMessage(message) {
    const options = {
        QueueUrl: sqsUrl,
        ReceiptHandle: message.ReceiptHandle
    };

    const handler = (error, data) => {
        if (error) {
            eyes.inspect(error);
            return;
        }

        eyes.inspect(data);
    };

    client.deleteMessage(options, handler);
}
