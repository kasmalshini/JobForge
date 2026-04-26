const nodemailer = require('nodemailer');
require('dotenv').config();

const createTransporter = async () => {
  const smtpHost = (process.env.SMTP_HOST || '').trim();
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpUser = (process.env.SMTP_USER || '').trim();
  const smtpPass = (process.env.SMTP_PASS || '').trim();
  const smtpSecure = String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true';
  const gmailEmail = (process.env.GMAIL_EMAIL || '').trim();
  const gmailPassword = (process.env.GMAIL_PASSWORD || '').trim();
  const usingSmtpProvider = Boolean(smtpHost && smtpUser && smtpPass);

  if (usingSmtpProvider) {
    return {
      transporter: nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      }),
      mode: 'smtp',
    };
  }

  if (!gmailEmail || !gmailPassword) {
    throw new Error('Email provider is not configured. Set SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS (recommended) or GMAIL_EMAIL/GMAIL_PASSWORD.');
  }

  return {
    transporter: nodemailer.createTransport({
      service: 'gmail',
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
      auth: {
        user: gmailEmail,
        pass: gmailPassword,
      },
    }),
    mode: 'gmail',
  };
};

const createDevTestTransporter = async () => {
  const testAccount = await nodemailer.createTestAccount();
  return {
    transporter: nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    }),
    mode: 'ethereal',
  };
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken, resetLink) => {
  try {
    const { transporter } = await createTransporter();
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
      previewUrl: nodemailer.getTestMessageUrl(result) || null,
      deliveryMode: 'primary',
    };
  } catch (error) {
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const canFallbackToDevInbox = /Invalid login|EAUTH|Username and Password not accepted|Unexpected socket close|ETIMEDOUT|ECONNRESET/i.test(
      String(error?.message || '')
    );

    if (isDevelopment && canFallbackToDevInbox) {
      try {
        const { transporter } = await createDevTestTransporter();
        const fallbackFrom = (process.env.EMAIL_FROM || 'JobForge Dev <dev@jobforge.local>').trim();
        const fallbackResult = await transporter.sendMail({
          from: fallbackFrom,
          to: email,
          subject: 'Password Reset Request - JobForge (Dev Test Mail)',
          html: `
            <h2>Password Reset Request</h2>
            <p>Development fallback email generated because primary email login failed.</p>
            <a href="${resetLink}" style="background-color: #238845; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0;">
              Reset Password
            </a>
            <p>Reset link:</p>
            <code>${resetLink}</code>
            <p><strong>This link will expire in 10 minutes.</strong></p>
          `,
        });

        return {
          success: true,
          messageId: fallbackResult.messageId,
          previewUrl: nodemailer.getTestMessageUrl(fallbackResult) || null,
          deliveryMode: 'dev-fallback',
        };
      } catch (fallbackError) {
        console.error('Dev fallback email error:', fallbackError);
      }
    }

    console.error('Email sending error:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// Send verification email
const sendVerificationEmail = async (email, verificationLink) => {
  try {
    const { transporter } = await createTransporter();
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
      previewUrl: nodemailer.getTestMessageUrl(result) || null,
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
