// queue/welcomeEmailQueue.ts
import Queue  from "bull";
import { sendWelcomeEmail } from "../mailConfig/emails";
import { Queue as BullQueue } from "bull";

export const welcomeEmailQueue: BullQueue = new Queue("welcomeEmail", {
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT) 
  },
});

// Queue Processor
welcomeEmailQueue.process(async (job) => {
  const { email, name } = job.data;

  try {
    await sendWelcomeEmail(email, name);
    return Promise.resolve();
  } catch (error) {
    console.error("❌ Failed to send welcome email:", error);
    return Promise.reject(error);
  }
});
