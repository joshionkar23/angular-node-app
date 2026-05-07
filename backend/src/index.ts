import { app } from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";

let isShuttingDown = false;

const startServer = async (): Promise<void> => {
  await connectDatabase();

  const server = app.listen(env.PORT, () => {
    logger.info(`API server listening on port ${env.PORT}`);
  });

  const shutdown = async (signal: string): Promise<void> => {
    if (isShuttingDown) {
      return;
    }

    isShuttingDown = true;
    logger.warn("Shutdown signal received", { signal });

    server.close(async (serverCloseError) => {
      if (serverCloseError) {
        logger.error("Error while closing HTTP server", { err: serverCloseError });
      }

      try {
        await disconnectDatabase();
      } catch (error) {
        logger.error("Error during database disconnect", { err: error });
      } finally {
        process.exit(serverCloseError ? 1 : 0);
      }
    });

    setTimeout(() => {
      logger.error("Force exiting after shutdown timeout");
      process.exit(1);
    }, 10000).unref();
  };

  process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
  });

  process.on("SIGINT", () => {
    void shutdown("SIGINT");
  });
};

startServer().catch((error) => {
  logger.error("Failed to start backend service", { err: error });
  process.exit(1);
});
