import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const allowedOrigins = (Deno.env.get("ALLOWED_ORIGINS") ?? "")
  .split(",")
  .map((origin: string) => origin.trim())
  .filter(Boolean);

const resolveOrigin = (origin: string | null) => {
  if (!origin) return "*";
  if (allowedOrigins.length === 0) return "*";
  return allowedOrigins.includes(origin) ? origin : "";
};

const buildCorsHeaders = (origin: string | null) => {
  const allowedOrigin = resolveOrigin(origin);
  const headers: Record<string, string> = {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (allowedOrigin !== "*" && allowedOrigin !== "") {
    headers["Access-Control-Allow-Credentials"] = "true";
  }

  return headers;
};

const isAdminUser = (user: { app_metadata?: Record<string, unknown> }) => {
  const appRole = user.app_metadata?.role;
  return appRole === "admin";
};

const handler = async (req: Request): Promise<Response> => {
  const corsHeaders = buildCorsHeaders(req.headers.get("Origin"));
  if (corsHeaders["Access-Control-Allow-Origin"] === "") {
    return new Response(JSON.stringify({ error: "Origin not allowed" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: "Server misconfigured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) {
    return new Response(JSON.stringify({ error: "Missing authorization" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
  if (userError || !userData.user) {
    return new Response(JSON.stringify({ error: "Invalid session" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!isAdminUser(userData.user)) {
    return new Response(JSON.stringify({ error: "Not authorized" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const body = await req.json().catch(() => null);
  const comics = body?.comics;
  if (!Array.isArray(comics) || comics.length === 0) {
    return new Response(JSON.stringify({ error: "No comics provided" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (comics.length > 500) {
    return new Response(JSON.stringify({ error: "Too many comics in one request" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const requiredFields = ["title", "issues", "year", "link", "cover", "idiomId", "publisherId"];
  const isNonEmptyString = (value: unknown) => typeof value === "string" && value.trim().length > 0;
  const isValidNumber = (value: unknown) => typeof value === "number" && Number.isFinite(value);

  for (const [index, comic] of comics.entries()) {
    if (!comic || typeof comic !== "object") {
      return new Response(JSON.stringify({ error: `Comic ${index + 1} is invalid` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    for (const field of requiredFields) {
      if (comic[field] === undefined || comic[field] === null || comic[field] === "") {
        return new Response(JSON.stringify({ error: `Comic ${index + 1} is missing ${field}` }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    if (!isNonEmptyString(comic.title)) {
      return new Response(JSON.stringify({ error: `Comic ${index + 1} has invalid title` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!isValidNumber(comic.issues) || !isValidNumber(comic.year)) {
      return new Response(JSON.stringify({ error: `Comic ${index + 1} has invalid numeric fields` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!isValidNumber(comic.idiomId) || !isValidNumber(comic.publisherId)) {
      return new Response(JSON.stringify({ error: `Comic ${index + 1} has invalid idiomId/publisherId` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!isNonEmptyString(comic.link) || !isNonEmptyString(comic.cover)) {
      return new Response(JSON.stringify({ error: `Comic ${index + 1} has invalid text fields` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }
  
  const { error } = await supabaseAdmin.from("Comic").insert(comics);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ inserted: comics.length }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
};

Deno.serve({ handler });
