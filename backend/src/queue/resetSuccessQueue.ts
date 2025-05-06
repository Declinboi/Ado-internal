import Queue from "bull";
import { sendResetSuccessEmail } from "../mailConfig/emails";

export const resetSuccessQueue = new Queue("resetSuccessQueue", {
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

resetSuccessQueue.process(async (job) => {
  const { email } = job.data;

  try {
    await sendResetSuccessEmail(email);
    return Promise.resolve();
  } catch (err) {
    console.error("❌ Reset success email failed:", err);
    return Promise.reject(err);
  }
});
