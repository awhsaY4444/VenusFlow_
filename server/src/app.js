import cors from "cors";
import express from "express";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { config } from "./config.js";
import { authRouter } from "./routes/auth.routes.js";
import { dashboardRouter } from "./routes/dashboard.routes.js";
import { tasksRouter } from "./routes/tasks.routes.js";
import { usersRouter } from "./routes/users.routes.js";
import { requireAuth } from "./middleware/auth.js";
import { tenantMiddleware } from "./middleware/tenant.js";
import { inviteRouter } from "./routes/invite.routes.js";
import { notificationRouter } from "./routes/notification.routes.js";
import { analyticsRouter } from "./routes/analytics.routes.js";
import { oauthRouter } from "./routes/oauth.routes.js";
import { setupSwagger } from "./utils/swagger.js";
import { errorHandler } from "./middleware/error-handler.js";

export const app = express();

// 1. Security Headers
app.use(helmet());

// 2. Swagger Docs
setupSwagger(app);

// 3. Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);

app.use(
  cors({
    origin: config.clientUrl,
    credentials: false,
  })
);
app.use(express.json());

// 4. Health checks
app.get("/health", (_req, res) => {
  res.json({ status: "up", timestamp: new Date().toISOString() });
});

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "VenusFlow API healthy" });
});

app.get("/", (_req, res) => {
  res.redirect("/api-docs");
});

// 5. Routes
app.use("/api/auth", authRouter);
app.use("/api/auth/oauth", oauthRouter);
app.use("/api/invites", inviteRouter);

// Protected routes (Tenant Isolation enforced via tenantMiddleware)
app.use("/api/dashboard", requireAuth, tenantMiddleware, dashboardRouter);
app.use("/api/tasks", requireAuth, tenantMiddleware, tasksRouter);
app.use("/api/users", requireAuth, tenantMiddleware, usersRouter);
app.use("/api/notifications", requireAuth, notificationRouter);
app.use("/api/analytics", requireAuth, tenantMiddleware, analyticsRouter);

// 6. Global Error Handling
app.use(errorHandler);
