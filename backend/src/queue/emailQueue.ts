// src/queues/emailQueue.ts
import Queue  from "bull";
import Redis from "ioredis";
import { sendVerificationEmail } from "../mailConfig/emails";
// import { sendVerificationEmail } from "../utils/sendVerificationEmail";

const redisOptions = {
  redis: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,
  },
};

export const emailQueue = new Queue("emailQueue", redisOptions);

// Process the queue
emailQueue.process(async (job:any) => {
  const { email, name, token } = job.data;
  await sendVerificationEmail(email, name, token);
});
