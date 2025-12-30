import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  db: {
    schema: "public",
  },
});

export async function testConnection() {
  console.log("🔍 Testing Supabase connection...");

  try {
    console.log(`\n🔗 Connecting to: ${SUPABASE_URL}`);

    const { data, error, count } = await supabase
      .from("Comic")
      .select("*", { count: "exact" })
      .limit(1);

    if (error) {
      throw new Error(
        `Supabase query failed: ${error.message} (Code: ${error.code})`
      );
    }

    console.log("✅ Supabase connection SUCCESSFUL!");
    console.log(`📊 Database test: Found ${count} comics in database`);
    console.log(`🎯 Sample data:`, data[0] || "No data");
    console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log("🚀 Database ready for API requests!");

    return { success: true, count, sampleData: data };
  } catch (error: any) {
    console.error("❌ Supabase connection FAILED!");
    console.error(`💥 Error: ${error.message}`);

    if (error.message.includes("Missing environment variables")) {
      console.error(
        "🔧 Solution: Check your .env file and ensure SUPABASE_URL and SUPABASE_ANON_KEY are set"
      );
    } else if (error.message.includes("Invalid API key")) {
      console.error("🔐 Solution: Verify your SUPABASE_ANON_KEY is correct");
    } else if (
      error.message.includes("relation") &&
      error.message.includes("does not exist")
    ) {
      console.error(
        "📋 Solution: Check if your database tables exist (Idiom, Comic, Issue, etc.)"
      );
    } else {
      console.error(
        "🌐 Solution: Verify your SUPABASE_URL and network connection"
      );
    }

    console.error("⚠️  Server will continue but API endpoints will not work");
    throw error;
  }
}
