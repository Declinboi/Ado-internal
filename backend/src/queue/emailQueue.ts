import Queue from "bull";
import { sendVerificationEmail } from "../mailConfig/emails";

export const emailQueue = new Queue("emailQueue", {
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

emailQueue.process(async (job) => {
  const { email, name, token } = job.data;

  try {
    await sendVerificationEmail(email, name, token);
    return Promise.resolve();
  } catch (err) {
    console.error("❌ Verification email failed:", err);
    return Promise.reject(err);
  }
});
