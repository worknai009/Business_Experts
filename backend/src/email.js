import nodemailer from "nodemailer";

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return null;

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass }
  });
  return transporter;
}

export async function sendOtpEmail(email, code) {
  const activeTransporter = getTransporter();
  const brand = process.env.EMAIL_BRAND_NAME || "Business Experts";

  if (!activeTransporter) {
    console.log(`[OTP email not configured] ${email} -> ${code}`);
    return { sent: false };
  }

  await activeTransporter.sendMail({
    from: `"${brand}" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: `${code} is your ${brand} verification code`,
    text: `Your ${brand} verification code is ${code}. It expires in 10 minutes.\n\nIf you didn't request this, you can safely ignore this email.`,
    html: `<div style="font-family:sans-serif;max-width:420px;margin:0 auto;padding:24px;">
      <p style="color:#334155;font-size:15px;">Your ${brand} verification code is:</p>
      <p style="font-size:32px;font-weight:700;letter-spacing:6px;color:#0b1220;margin:16px 0;">${code}</p>
      <p style="color:#64748b;font-size:13px;">This code expires in 10 minutes. If you didn't request this, you can safely ignore this email.</p>
    </div>`
  });

  return { sent: true };
}
