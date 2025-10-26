import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

const {
  PORT,
  SERVER_URL,
  NODE_ENV,
  DB_URI,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  ARCJET_ENV,
  ARCJET_KEY,
  QSTASH_URL,
  QSTASH_TOKEN,
  EMAIL_PASSWORD,
} = process.env;

// VALIDATION
if (!DB_URI) {
  throw new Error("DB_URI is required in environment variables");
}
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is required in environment variables");
}
if (!SERVER_URL) {
  throw new Error("SERVER_URL is required for workflow triggers");
}
if (!ARCJET_KEY) {
  throw new Error("ARCJET_KEY is required for security");
}
if (!QSTASH_URL || !QSTASH_TOKEN) {
  throw new Error("QSTASH_URL and QSTASH_TOKEN are required for workflows");
}
if (!EMAIL_PASSWORD) {
  throw new Error("EMAIL_PASSWORD is required for email sending");
}

export {
  PORT,
  SERVER_URL,
  NODE_ENV,
  DB_URI,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  ARCJET_KEY,
  QSTASH_URL,
  QSTASH_TOKEN,
  EMAIL_PASSWORD,
};
