const nodemailer = require('nodemailer');
require('dotenv').config();

const createTransporter = () => {
  const smtpHost = (process.env.SMTP_HOST || '').trim();
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpUser = (process.env.SMTP_USER || '').trim();
  const smtpPass = (process.env.SMTP_PASS || '').trim();
  const smtpSecure = String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true';
  const gmailEmail = (process.env.GMAIL_EMAIL || '').trim();
  const gmailPassword = (process.env.GMAIL_PASSWORD || '').trim();
  const usingSmtpProvider = Boolean(smtpHost && smtpUser && smtpPass);

  if (usingSmtpProvider) {
    return nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
  }

  if (!gmailEmail || !gmailPassword) {
    throw new Error('Email provider is not configured. Set SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS (recommended) or GMAIL_EMAIL/GMAIL_PASSWORD.');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailEmail,
      pass: gmailPassword,
    },
  });
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken, resetLink) => {
  try {
    const transporter = createTransporter();
    const fromEmail = (process.env.EMAIL_FROM || process.env.SMTP_FROM || process.env.GMAIL_EMAIL || '').trim();

    const mailOptions = {
      from: fromEmail,
      to: email,
      subject: 'Password Reset Request - JobForge',
      html: `
        <h2>Password Reset Request</h2>
        <p>You have requested to reset your password. Click the link below to reset it:</p>
        <a href="${resetLink}" style="background-color: #238845; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0;">
          Reset Password
        </a>
        <p>Or copy and paste this URL in your browser:</p>
        <code>${resetLink}</code>
        <p><strong>This link will expire in 10 minutes.</strong></p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    return {
      success: true,
      messageId: result.messageId,
    };
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// Send verification email
const sendVerificationEmail = async (email, verificationLink) => {
  try {
    const transporter = createTransporter();
    const fromEmail = (process.env.EMAIL_FROM || process.env.SMTP_FROM || process.env.GMAIL_EMAIL || '').trim();

    const mailOptions = {
      from: fromEmail,
      to: email,
      subject: 'Verify Your Email - JobForge',
      html: `
        <h2>Email Verification</h2>
        <p>Welcome to JobForge! Click the link below to verify your email:</p>
        <a href="${verificationLink}" style="background-color: #238845; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0;">
          Verify Email
        </a>
        <p>Or copy and paste this URL in your browser:</p>
        <code>${verificationLink}</code>
        <p><strong>This link will expire in 24 hours.</strong></p>
        <p>If you did not sign up for JobForge, please ignore this email.</p>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    return {
      success: true,
      messageId: result.messageId,
    };
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendVerificationEmail,
};
