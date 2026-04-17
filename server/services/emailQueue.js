const User = require('../models/User');
const { sendVerificationEmail } = require('./emailService');

const verificationQueue = [];
let queueTimer = null;
const MAX_RETRIES = 5;
const BASE_RETRY_MS = 30 * 1000;

const scheduleVerificationEmail = ({ userId, email, verificationLink, retryCount = 0 }) => {
  const backoffMs = retryCount === 0 ? 0 : BASE_RETRY_MS * Math.pow(2, retryCount - 1);
  verificationQueue.push({
    type: 'verification',
    userId,
    email,
    verificationLink,
    retryCount,
    nextAttemptAt: Date.now() + backoffMs,
  });
};

const processVerificationJob = async (job) => {
  try {
    await sendVerificationEmail(job.email, job.verificationLink);
    await User.findByIdAndUpdate(job.userId, {
      verificationEmailStatus: 'sent',
      verificationEmailRetryCount: job.retryCount,
    });
  } catch (error) {
    const nextRetryCount = job.retryCount + 1;
    await User.findByIdAndUpdate(job.userId, {
      verificationEmailStatus: 'failed',
      verificationEmailRetryCount: nextRetryCount,
    });

    if (nextRetryCount < MAX_RETRIES) {
      scheduleVerificationEmail({
        userId: job.userId,
        email: job.email,
        verificationLink: job.verificationLink,
        retryCount: nextRetryCount,
      });
    }
  }
};

const processQueue = async () => {
  const now = Date.now();
  const dueJobs = verificationQueue.filter((job) => job.nextAttemptAt <= now);

  for (const job of dueJobs) {
    const index = verificationQueue.indexOf(job);
    if (index > -1) {
      verificationQueue.splice(index, 1);
    }
    if (job.type === 'verification') {
      await processVerificationJob(job);
    }
  }
};

const startEmailQueue = () => {
  if (queueTimer) {
    return;
  }
  queueTimer = setInterval(() => {
    processQueue().catch((error) => {
      console.error('Email queue processing error:', error);
    });
  }, 5000);
};

module.exports = {
  startEmailQueue,
  scheduleVerificationEmail,
};
