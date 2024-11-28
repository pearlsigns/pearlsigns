// Your AccountSID and Auth Token from console.twilio.com
const accountSid = 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
const authToken = 'your_auth_token';

const client = require('twilio')(accountSid, authToken);




try {
    const message = await client.messages.create({
      body: 'Hello from Node',
      to: '+12345678901',
      from: '+12345678901',
    });
    console.log(message);
  } catch (error) {
    // You can implement your fallback code here
    console.error(error);
  }