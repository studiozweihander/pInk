import { Elysia } from "elysia";
import { AppError } from "@/shared/errors/AppError";
import { env } from "@/config/env";

export const errorHandler = new Elysia({ name: "errorHandler" }).onError(
  ({ code, error, set }) => {
    const timestamp = new Date().toISOString();
    if (error instanceof AppError) {
      set.status = error.statusCode;

      console.error(
        `❌ [${timestamp}] AppError: ${error.message} (Status: ${error.statusCode})`
      );

      return {
        success: false,
        message: error.message,
        error: error.isOperational ? error.message : "Internal server error",
      };
    }

    if (code === "NOT_FOUND") {
      set.status = 404;
      console.warn(`⚠️  [${timestamp}] Route not found`);
      return {
        success: false,
        message: "Endpoint not found",
      };
    }

    if (code === "VALIDATION") {
      set.status = 400;
      console.warn(
        `⚠️  [${timestamp}] Validation error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      return {
        success: false,
        message: "Validation error",
        error:
          env.server.nodeEnv === "development"
            ? error instanceof Error
              ? error.message
              : String(error)
            : undefined,
      };
    }

    if (code === "PARSE") {
      set.status = 400;
      console.warn(`⚠️  [${timestamp}] Parse error: Invalid request body`);
      return {
        success: false,
        message: "Invalid request body",
      };
    }

    set.status = 500;
    console.error(`❌ [${timestamp}] Unexpected error:`, {
      code,
      message: error instanceof Error ? error.message : String(error),
      stack:
        env.server.nodeEnv === "development" && error instanceof Error
          ? error.stack
          : undefined,
    });

    return {
      success: false,
      message:
        env.server.nodeEnv === "development"
          ? error instanceof Error
            ? error.message
            : String(error)
          : "Internal server error",
    };
  }
);
