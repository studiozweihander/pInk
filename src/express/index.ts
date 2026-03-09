import express from "express";
import cors from "cors";
import { APP_VERSION } from "../constants";
import {
  getAllComics,
  getComicById,
  getComicIssues,
} from "../server/services/comicsService";
import { getAllIssues, getIssueById } from "../server/services/issuesService";
import { createSupabaseClient } from "../server/services/supabaseClient";
import { ApiNotFoundError, toErrorMessage } from "../server/services/errors";

export function createExpressApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({
      status: "OK",
      timestamp: new Date().toISOString(),
      version: APP_VERSION,
    });
  });

  app.get("/", (_req, res) => {
    res.json({
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

  app.get("/api/comics", async (_req, res, next) => {
    try {
      const supabase = createSupabaseClient();
      const response = await getAllComics(supabase);
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/comics/:id", async (req, res, next) => {
    try {
      const supabase = createSupabaseClient();
      const response = await getComicById(req.params.id, supabase);
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/comics/:id/issues", async (req, res, next) => {
    try {
      const supabase = createSupabaseClient();
      const response = await getComicIssues(req.params.id, supabase);
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/issues", async (req, res, next) => {
    try {
      const supabase = createSupabaseClient();
      const response = await getAllIssues(
        {
          limit: req.query.limit as string | undefined,
          offset: req.query.offset as string | undefined,
          search: req.query.search as string | undefined,
        },
        supabase,
      );
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/issues/:id", async (req, res, next) => {
    try {
      const supabase = createSupabaseClient();
      const response = await getIssueById(req.params.id, supabase);
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const message = toErrorMessage(error);

    if (error instanceof ApiNotFoundError) {
      res.status(404).json({
        success: false,
        message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message,
    });
  });

  return app;
}
