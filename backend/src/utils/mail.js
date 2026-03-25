import nodemailer from 'nodemailer';
import { google } from 'googleapis';

const getTransporter = async () => {
  console.log("📧 [Mailer] Initializing OAuth2 client...");

  const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  );

  if (!process.env.GMAIL_CLIENT_ID) console.error("❌ [Mailer] GMAIL_CLIENT_ID is missing!");
  if (!process.env.GMAIL_CLIENT_SECRET) console.error("❌ [Mailer] GMAIL_CLIENT_SECRET is missing!");
  if (!process.env.GMAIL_REFRESH_TOKEN) console.error("❌ [Mailer] GMAIL_REFRESH_TOKEN is missing!");
  if (!process.env.GMAIL_EMAIL) console.error("❌ [Mailer] GMAIL_EMAIL is missing!");

  oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN
  });

  console.log("🔑 [Mailer] Fetching access token...");
  let accessToken;
  try {
    const tokenResponse = await oauth2Client.getAccessToken();
    accessToken = tokenResponse.token;
    if (!accessToken) {
      throw new Error("Access token is null or undefined after fetch");
    }
    console.log("✅ [Mailer] Access token fetched successfully");
  } catch (err) {
    console.error("❌ [Mailer] Failed to fetch access token:");
    console.error("   Message:", err.message);
    console.error("   Details:", err.response?.data || "No additional details");
    throw new Error(`OAuth2 token fetch failed: ${err.message}`);
  }

  console.log("🚀 [Mailer] Creating nodemailer transporter...");
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_EMAIL,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken,
      },
    });
    console.log("✅ [Mailer] Transporter created successfully");
    return transporter;
  } catch (err) {
    console.error("❌ [Mailer] Failed to create transporter:");
    console.error("   Message:", err.message);
    throw new Error(`Transporter creation failed: ${err.message}`);
  }
};

const sendMail = async ({ to, subject, html, text }) => {
  console.log(`📨 [Mailer] Attempting to send email to: ${to}`);
  console.log(`   Subject: ${subject}`);

  let transporter;
  try {
    transporter = await getTransporter();
  } catch (err) {
    console.error("❌ [Mailer] Could not initialize transporter. Aborting send.");
    throw err;
  }

  try {
    const result = await transporter.sendMail({
      from: `"IIT Ropar Marketplace" <${process.env.GMAIL_EMAIL}>`,
      to,
      subject,
      html,
      text,
    });
    console.log(`✅ [Mailer] Email sent successfully to: ${to}`);
    console.log(`   Message ID: ${result.messageId}`);
    return result;
  } catch (err) {
    console.error(`❌ [Mailer] Failed to send email to: ${to}`);
    console.error("   Error code:", err.code || "N/A");
    console.error("   Error message:", err.message);
    console.error("   SMTP response:", err.response || "No SMTP response");
    console.error("   Full error:", err);
    throw new Error(`Email sending failed: ${err.message}`);
  }
};

export default sendMail;