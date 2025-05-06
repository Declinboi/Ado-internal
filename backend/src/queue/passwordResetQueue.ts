import Queue from "bull";
import { sendPasswordResetEmail } from "../mailConfig/emails";

export const passwordResetQueue = new Queue("passwordResetQueue", {
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

passwordResetQueue.process(async (job:any) => {
  const { email, resetUrl } = job.data;

  try {
    await sendPasswordResetEmail(email, resetUrl);
    console.log(`✅ Password reset email sent to ${email}`);
    return Promise.resolve();
  } catch (err) {
    console.error("❌ Password reset email failed:", err);
    return Promise.reject(err);
  }
});
