// Your AccountSID and Auth Token from console.twilio.com

const client = require('twilio')(process.env.TWILIO_ACC_SSID, process.env.TWILIO_AUTH_TOKEN);

const sendMessage = () => {
  client.messages
    .create({
      body: 'Hello from twilio-node',
      to: '+14379722799', // Text your number
      from: '+17753209966', // From a valid Twilio number
    })
    .then((message) => console.log(message.sid));
}

module.exports = {sendMessage}