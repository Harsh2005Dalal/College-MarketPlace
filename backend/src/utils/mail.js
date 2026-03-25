import nodemailer from "nodemailer";

export const sendMail = async ({ to, subject, text, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // TLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false, // helps in cloud sometimes
      },
      connectionTimeout: 30000,
      socketTimeout: 30000,
    });

    console.log("📨 Sending mail to:", to);

    const info = await transporter.sendMail({
      from: `"College Marketplace" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("✅ Mail sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ MAIL ERROR:", error);
    throw error;
  }
};