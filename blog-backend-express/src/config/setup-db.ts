import path from "path";
import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const DB_NAME = process.env.DB_NAME || "vynblog";
const DB_USER = process.env.DB_USER || "postgres";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = parseInt(process.env.DB_PORT || "5432");

async function setupDatabase(): Promise<void> {
  const client = new Client({
    user: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: DB_PORT,
    database: "postgres",
  });

  try {
    await client.connect();
    console.log("Connected to PostgreSQL server");

    const result = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [DB_NAME],
    );

    if (result.rows.length === 0) {
      await client.query(`CREATE DATABASE ${DB_NAME}`);
      console.log(`Database '${DB_NAME}' created successfully`);
    } else {
      console.log(`Database '${DB_NAME}' already exists`);
    }

    await client.end();

    console.log("\n Database setup complete!");
    console.log(`\nYou can now start the server with: npm run dev`);
  } catch (error: any) {
    console.error("Database setup failed:", error.message);

    if (error.code === "28P01") {
      console.error(
        "\n Authentication failed. Please check your database credentials in .env file",
      );
    } else if (error.code === "ECONNREFUSED") {
      console.error(
        "\n Could not connect to PostgreSQL server. Make sure PostgreSQL is running.",
      );
    }

    process.exit(1);
  }
}

setupDatabase();