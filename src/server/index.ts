import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { testConnection } from "./config/database";
import { comicsController } from "./controllers/comicsController";
import { issuesController } from "./controllers/issuesController";
import { APP_VERSION } from "../constants";

const PORT = process.env.PORT || 3000;

const app = new Elysia()
  .use(cors())
  .use((app) =>
    process.env.NODE_ENV === "development" ? app.use(swagger()) : app,
  )
  .get("/health", () => ({
    status: "OK",
    timestamp: new Date().toISOString(),
    version: APP_VERSION,
  }))
  .group("/api", (app) =>
    app
      .group("/comics", (app) =>
        app
          .get("/", () => comicsController.getAllComics())
          .get("/:id", comicsController.getComicById)
          .get("/:id/issues", comicsController.getComicIssues),
      )
      .group("/issues", (app) =>
        app
          .get("/", issuesController.getAllIssues)
          .get("/:id", issuesController.getIssueById),
      ),
  )
  .get("/", () => ({
    name: `pInk API`,
    description: "Catálogo de quadrinhos",
    version: APP_VERSION,
    endpoints: {
      health: "/health",
      comics: "/api/comics",
      issues: "/api/issues",
    },
  }))
  .onError(({ code, error, set }) => {
    console.error(`❌ Error (${code}):`, error);

    const message = error instanceof Error ? error.message : String(error);
    const isNotFound = code === "NOT_FOUND" || message.startsWith("NOT_FOUND:");

    if (isNotFound) {
      set.status = 404;
      return {
        success: false,
        message: message.replace("NOT_FOUND: ", ""),
      };
    }

    set.status = 500;
    return {
      success: false,
      message: message || "Internal server error",
    };
  });

export type App = typeof app;
export { app };

async function start() {
  await testConnection();
  app.listen(PORT);
  console.log(`🚀 pInk server running on http://localhost:${PORT}`);
}

if (process.env.NODE_ENV !== "production") {
  start().catch((err) => {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  });
}
