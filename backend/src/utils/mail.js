import nodemailer from 'nodemailer';
import { google } from 'googleapis';

const getTransporter = async () => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN
  });

  const accessToken = await oauth2Client.getAccessToken();

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.GMAIL_EMAIL,
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
      accessToken: accessToken.token,
    },
  });
};

const sendMail = async ({ to, subject, html, text }) => {
  const transporter = await getTransporter();

  return transporter.sendMail({
    from: `"IIT Ropar Marketplace" <${process.env.GMAIL_EMAIL}>`,
    to,
    subject,
    html,
    text,
  });
};

export default sendMail;