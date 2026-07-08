import pkg, { Pool, QueryResult, QueryResultRow } from "pg";
import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";

const { types } = pkg;

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Force DATE columns to be returned as strings
types.setTypeParser(1082, (val: string) => val);
types.setTypeParser(1184, (val: string) => val);

// Create connection pool
export const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "blogdb",
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Initialize database schema
const initializeSchema = async (): Promise<void> => {
  try {
    const schemaPath = path.join(__dirname, "./schema.sql");

    if (!fs.existsSync(schemaPath)) {
      console.log("Schema file not found, skipping auto-initialization");
      return;
    }

    const schemaSql = fs.readFileSync(schemaPath, "utf8");

    // Execute the schema
    await pool.query(schemaSql);
    console.log("Database schema initialized successfully");
  } catch (error: any) {
    // If tables already exist
    if (error.code === "42P07" || error.message.includes("already exists")) {
      console.log("Database schema already exists");
    } else {
      console.error("Schema initialization warning:", error.message);
    }
  }
};

// Test database connection and initialize schema
export const testConnection = async (): Promise<void> => {
  try {
    const client = await pool.connect();
    console.log("Database connected successfully");
    client.release();

    // Initialize schema after successful connection
    await initializeSchema();
  } catch (error: any) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

// Execute raw query
export const query = async <T extends QueryResultRow = any>(
  sql: string,
  params: any[] = [],
): Promise<T[]> => {
  const result: QueryResult<T> = await pool.query(sql, params);
  return result.rows;
};

// Execute query and return first row
export const queryOne = async <T extends QueryResultRow = any>(
  sql: string,
  params: any[] = [],
): Promise<T | null> => {
  const result: QueryResult<T> = await pool.query(sql, params);
  return result.rows[0] ?? null;
};

export default {
  pool,
  query,
  queryOne,
  testConnection,
};