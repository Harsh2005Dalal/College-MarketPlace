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
    connectionTimeout: Number(process.env.SMTP_CONNECTION_TIMEOUT_MS || 10000),
    greetingTimeout: Number(process.env.SMTP_GREETING_TIMEOUT_MS || 10000),
    socketTimeout: Number(process.env.SMTP_SOCKET_TIMEOUT_MS || 15000),
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

  try {
    await Promise.race([
      transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to,
        subject,
        text,
        html,
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("SMTP send timeout")), 15000)
      ),
    ]);
    console.log("✅ Mail sent");
  } catch (err) {
    console.error("❌ MAIL ERROR:", err);
    throw err;
  }
};
