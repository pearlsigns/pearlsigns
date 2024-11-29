
const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";

const accountSid = process.env.TWILIO_ACC_SSID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const myPhone = process.env.MY_PHONE
const twPhone = process.env.TW_PHONE

const client = twilio(accountSid, authToken);

const sendMessage = (msgbody) => {
  try {
    client.messages
      .create({
        body: msgbody,
        to: 'whatsapp:+'+myPhone, // Text your number
        from: 'whatsapp:+'+twPhone, // From a valid Twilio number
      })
      .then((message) => console.log(message.sid));
  } catch (e) {
    throw e;
  }
}


module.exports = { sendMessage }