import { google } from 'googleapis';

const sendMail = async ({ to, subject, html, text }) => {
  console.log(`📨 [Mailer] Sending email to: ${to}`);

  const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN
  });

  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  // Build raw email
  const emailLines = [
    `From: "IIT Ropar Marketplace" <${process.env.GMAIL_EMAIL}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/html; charset=utf-8`,
    ``,
    html || text,
  ];

  const rawEmail = emailLines.join('\n');
  const encodedEmail = Buffer.from(rawEmail)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  try {
    const result = await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw: encodedEmail },
    });
    console.log(`✅ [Mailer] Email sent! Message ID: ${result.data.id}`);
    return result;
  } catch (err) {
    console.error(`❌ [Mailer] Gmail API send failed:`);
    console.error(`   Message: ${err.message}`);
    console.error(`   Details:`, err.response?.data || err);
    throw new Error(`Gmail API send failed: ${err.message}`);
  }
};

export default sendMail;