import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

import app from "@/app";
import { testConnection } from "./config/db";

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    // Test db connection
    await testConnection();

    app.listen(PORT, () => {
      console.log(`Blog Backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();