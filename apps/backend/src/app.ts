import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { logger } from "@/shared/middlewares/logger";
import { env } from "@/config/env";
export const createApp = () => {
  const app = new Elysia()
    .use(logger)
    .use(
      cors({
        origin: env.cors.origin,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    )
    .get(
      "/health",
      () => ({
        status: "OK",
        timestamp: new Date().toISOString(),
        environment: env.server.nodeEnv,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
      }),
      {
        response: t.Object({
          status: t.String(),
          timestamp: t.String(),
          environment: t.String(),
          uptime: t.Number(),
          memory: t.Object({
            rss: t.Number(),
            heapTotal: t.Number(),
            heapUsed: t.Number(),
            external: t.Number(),
            arrayBuffers: t.Number(),
          }),
        }),
        detail: {
          tags: ["Health"],
          summary: "Health check endpoint",
          description:
            "Returns server status and basic metrics",
        },
      }
    )
    .get(
      "/",
      () => ({
        name: "pInk API",
        version: "0.1.0",
        description: "pInk Backend API",
        health: "/health",
        endpoints: {
          comics: "/api/comics",
          issues: "/api/issues",
        },
      }),
      {
        response: t.Object({
          name: t.String(),
          version: t.String(),
          description: t.String(),
          health: t.String(),
          endpoints: t.Object({
            comics: t.String(),
            issues: t.String(),
          }),
        }),
        detail: {
          tags: ["Info"],
          summary: "API information",
          description:
            "Returns basic API information and available endpoints",
        },
      }
    )
    .onError(({ code, error, set }) => {
      console.error("❌ Global error handler:", { code, error });
      if (code === "NOT_FOUND") {
        set.status = 404;
        return { success: false, message: "Endpoint not found" };
      }
      if (code === "VALIDATION") {
        set.status = 400;
        return {
          success: false,
          message: "Validation error",
          error: error.message,
        };
      }
      if (code === "PARSE") {
        set.status = 400;
        return {
          success: false,
          message: "Invalid request body",
        };
      }
      set.status = 500;
      return {
        success: false,
        message:
          env.server.nodeEnv === "development"
            ? error
            : "Internal server error",
      };
    });
  return app;
};