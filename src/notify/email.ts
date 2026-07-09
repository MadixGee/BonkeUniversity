import nodemailer from 'nodemailer';
import { config } from '../config.js';

export async function sendEmail(subject: string, body: string): Promise<void> {
  if (!config.smtpHost || !config.smtpUser || !config.smtpPass) {
    console.warn('SMTP settings are not configured; skipping email notification.');
    return;
  }

  const transport = nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: false,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },
  });

  await transport.sendMail({
    from: config.smtpFrom,
    to: config.smtpUser,
    subject,
    text: body,
  });
}
