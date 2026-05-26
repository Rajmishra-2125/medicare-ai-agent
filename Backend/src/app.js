import express from "express";
import { app } from "./socket.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import logger from "./utils/logger.js";

// CORS
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked: ${origin} is not allowed`));
    },

    credentials: true,

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],

    allowedHeaders: ["Content-Type", "Authorization"],

    maxAge: 86400,
  })
);

// Security & Logger
app.use(
  helmet({
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false,
  })
);

// Use Morgan with Winston stream
const morganFormat = process.env.NODE_ENV === "production" ? "combined" : "dev";
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Common middlewares
app.use(express.json({ limit: "16kb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

app.use(express.static("public"));
app.use(cookieParser());

app.get("/healthcheck", (req, res) => {
  res.status(200).send("OK");
});

// import Routes
import healthcheckRouter from "./routes/healthcheck.routes.js";
import adminRouter from "./routes/admin.routes.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import doctorRouter from "./routes/doctor.routes.js";
import appointmentRouter from "./routes/appointment.routes.js";
import reviewRouter from "./routes/review.routes.js";
import slotsRouter from "./routes/slots.routes.js";
import medicalRecordsRouter from "./routes/medicalRecords.routes.js";
import agentRouter from "./routes/agent.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import notificationRouter from "./routes/notification.routes.js";

// routes
app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/doctors", doctorRouter);
app.use("/api/v1/slots", slotsRouter); // Mounted slots router
app.use("/api/v1/appointments", appointmentRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/medical-records", medicalRecordsRouter);
app.use("/api/v1/agent", agentRouter);
app.use("/api/v1/payments", paymentRouter);
app.use("/api/v1/notifications", notificationRouter);

// Error Middleware (Must be last)
import { errorHandler } from "./middlewares/error.middleware.js";
app.use(errorHandler);

export { app };
