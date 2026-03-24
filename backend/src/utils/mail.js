import nodemailer from "nodemailer";

const getTransporter = () => {
  const hasSmtp = Boolean(
    String(process.env.SMTP_HOST || "").trim() &&
      String(process.env.SMTP_USER || "").trim() &&
      String(process.env.SMTP_PASS || "").trim()
  );

  if (!hasSmtp) return null;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const sendMail = async ({ to, subject, text, html }) => {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn(
      "[MAIL PREVIEW MODE] SMTP is not fully configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS in backend/.env."
    );
    console.log("[MAIL PREVIEW]", { to, subject, text });
    return;
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
  });
};
