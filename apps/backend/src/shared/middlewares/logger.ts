import { Elysia } from "elysia";
import { env } from "@/config/env";

export const logger = new Elysia({ name: "logger" })
  .onRequest(({ request }) => {
    const url = new URL(request.url);
    const timestamp = new Date().toISOString();

    if (env.server.nodeEnv === "development") {
      console.log(
        `[${timestamp}] ${request.method} ${url.pathname}${url.search}`
      );
    }
  })
  .onAfterResponse(({ request, set, responseValue }) => {
    const url = new URL(request.url);
    const timestamp = new Date().toISOString();

    if (env.server.nodeEnv === "development") {
      console.log(
        `📤 [${timestamp}] ${request.method} ${url.pathname} - Status: ${
          set.status || 200
        }`
      );
    }
  })
  .onError(({ error, code, request }) => {
    const url = new URL(request.url);
    const timestamp = new Date().toISOString();

    console.error(
      `❌ [${timestamp}] ${request.method} ${url.pathname} - Error:`,
      {
        code,
        message: error instanceof Error ? error.message : String(error),
      }
    );
  });
