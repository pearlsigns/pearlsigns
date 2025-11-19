// utils/sendEmail.js
const nodemailer = require('nodemailer');

async function sendEmail(subject, html) {
  try {
    const to = process.env.RECIEVER_EMAIL
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or 'hotmail', 'yahoo', etc.
      auth: {
        user: process.env.SENDER_EMAIL, // sender email address
        pass: process.env.SENDER_EMAIL_PASSWORD, // app password (not your main password)
      },
    });

    const mailOptions = {
      from: `"Quote Request" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
  }
}

module.exports = { sendEmail };
