import { createApp } from "@backend/app";
import { testConnection } from "@config/database";
import { env } from "@config/env";

const startServer = async () => {
  try {
    const isConnected = await testConnection();

    if (!isConnected) {
      console.error("❌ Failed to connect to database");
      process.exit(1);
    }

    const app = createApp();

    app.listen(env.server.port, () => {
      console.log("");
      console.log(`📍 Server running on: http://localhost:${env.server.port}`);
      console.log(
        `🏥 Health Check: http://localhost:${env.server.port}/health`
      );
      console.log(`📝 Environment: ${env.server.nodeEnv}`);
      console.log("");
    });
  } catch (error) {
    console.error("❌ Failed to start server");

    if (error instanceof Error) {
      console.error(`💥 Error: ${error.message}`);
      console.error("");
      console.error("Stack trace:", error.stack);
    }

    console.error("🔧 Please fix the errors above and try again");
    process.exit(1);
  }
};

process.on("SIGTERM", () => {
  console.log("");
  console.log("⚠️  SIGTERM received. Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("");
  console.log("⚠️  SIGINT received. Shutting down gracefully...");
  process.exit(0);
});

startServer();
