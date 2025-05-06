import express from "express";
import "dotenv/config";
import { sequelize } from "./config/sync";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes";
import { ExpressAdapter } from "@bull-board/express";
import { createBullBoard } from "@bull-board/api";
import { emailQueue } from "./queue/emailQueue";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import helmet from "helmet";
import redis from "./config/redis";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());

// Routes
app.use("/api/users", userRoutes);

// Bull Board Setup (Admin UI for Queue Monitoring)
const serverAdapter = new ExpressAdapter();
createBullBoard({
  queues: [new BullAdapter(emailQueue)],
  serverAdapter,
});
serverAdapter.setBasePath("/admin/queues");
app.use("/admin/queues", serverAdapter.getRouter());

// Start Server
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to DB");

    await sequelize.sync({ alter: true }); // Sync all models
    console.log("✅ DB Synced");

    await redis.set("test_connection", "Redis OK");
    console.log("✅ Redis test value set");

    app.listen(PORT, () => {
      console.log(` Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(" Error starting server:", error);
  }
})();
