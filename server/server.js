const PubNub = require('pubnub');

const options = {
    subscribeKey: process.env.PN_SUBSCRIBE_KEY,
    publishKey: process.env.PN_PUBLISH_KEY,
    secretKey: process.env.PN_SECRET_KEY,
    ssl: true
};

const pubnub = new PubNub(options);

const inspect = require('eyes').inspect;

inspect(options);

pubnub.addListener({
    message: function (message) {
        inspect(message);
    },
    status: function (status) {
        inspect(status);
    }
});
