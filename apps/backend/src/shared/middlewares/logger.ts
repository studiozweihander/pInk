import { Elysia } from "elysia";
import { env } from "@/config/env";
import { time } from "node:console";

export const logger = new Elysia({ name: "logger" })
  .onRequest(({ request }) => {
    const url = new URL(request.url);
    const timestamp = new Date().toISOString();

    if (env.server.nodeEnv === "development") {
      console.log(`[${timestamp}] ${request.method}${url.search}`);
    }
  })
  .onAfterResponse(({ request, set, responseValue }) => {
    const url = new URL(request.url)
    const timestamp = new Date().toISOString()
    if (env.server.nodeEnv === "development") {
      console.log(
        `📤 [${timestamp}] ${request.method} ${url.pathname} - Status: ${set.status ||
          200} - Body: ${JSON.stringify(responseValue)}`
      )
    }
  })
  .onError(({ error, code, request }) => {
    const url = new URL(request.url);
    const timestamp = new Date().toISOString();

    console.error(`❌ [${timestamp}] ${request.method} ${url.pathname} - Error:`, {
      code,
      message: error,
    });
})
