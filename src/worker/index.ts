import { Hono } from "hono";
import { cors } from "hono/cors";
import { APP_VERSION } from "../constants";
import {
  getAllComics,
  getComicById,
  getComicIssues,
} from "../server/services/comicsService";
import { getAllIssues, getIssueById } from "../server/services/issuesService";
import {
  RuntimeEnv,
  createSupabaseClient,
  readRuntimeEnv,
} from "../server/services/supabaseClient";
import { AppError, toErrorMessage } from "../server/services/errors";

type Bindings = RuntimeEnv;
type WorkerErrorStatus = 400 | 404 | 500 | 502;

function toWorkerErrorStatus(statusCode: number): WorkerErrorStatus {
  if (statusCode === 400 || statusCode === 404 || statusCode === 500 || statusCode === 502) {
    return statusCode;
  }

  return 500;
}

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", cors());

app.get("/health", (c) => {
  return c.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    version: APP_VERSION,
  });
});

app.get("/", (c) => {
  return c.json({
    name: "pInk API",
    description: "Catalogo de quadrinhos",
    version: APP_VERSION,
    endpoints: {
      health: "/health",
      comics: "/api/comics",
      issues: "/api/issues",
    },
  });
});

app.get("/api/comics", async (c) => {
  const supabase = createSupabaseClient(readRuntimeEnv(c.env));
  const response = await getAllComics(supabase);
  return c.json(response);
});

app.get("/api/comics/:id", async (c) => {
  const supabase = createSupabaseClient(readRuntimeEnv(c.env));
  const response = await getComicById(c.req.param("id"), supabase);
  return c.json(response);
});

app.get("/api/comics/:id/issues", async (c) => {
  const supabase = createSupabaseClient(readRuntimeEnv(c.env));
  const response = await getComicIssues(c.req.param("id"), supabase);
  return c.json(response);
});

app.get("/api/issues", async (c) => {
  const supabase = createSupabaseClient(readRuntimeEnv(c.env));
  const response = await getAllIssues(
    {
      limit: c.req.query("limit"),
      offset: c.req.query("offset"),
      search: c.req.query("search"),
    },
    supabase,
  );
  return c.json(response);
});

app.get("/api/issues/:id", async (c) => {
  const supabase = createSupabaseClient(readRuntimeEnv(c.env));
  const response = await getIssueById(c.req.param("id"), supabase);
  return c.json(response);
});

app.onError((error, c) => {
  const message = toErrorMessage(error);

  if (error instanceof AppError) {
    const status = toWorkerErrorStatus(error.statusCode);

    return c.json(
      {
        success: false,
        error: message,
        code: error.code,
      },
      status,
    );
  }

  return c.json(
    {
      success: false,
      error: message,
      code: "INTERNAL_ERROR",
    },
    500,
  );
});

export default app;
