import nodemailer from 'nodemailer'
import 'dotenv/config'

const required = [
  'GOOGLE_USER',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_REFRESH_TOKEN',
]
const missing = required.filter((key) => !process.env[key])

if (missing.length > 0) {
  throw new Error(`Missing environment variables: ${missing.join(', ')}`)
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.GOOGLE_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error('Error connecting to email server:', error.message);
  } else {
    console.log('Email server is ready to send messages');
  }
});

export const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Your Name" <${process.env.GOOGLE_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log('Message sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw error;
    // The catch block is for logging. throw is for telling the caller that it failed. Without throw, sendEmail finishes normally even when the email failed
  }
};

export default transporter;