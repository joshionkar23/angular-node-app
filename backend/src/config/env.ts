import "dotenv/config";
import Joi from "joi";

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid("development", "test", "production").default("development"),
  APP_NAME: Joi.string().default("backend-service"),
  PORT: Joi.number().integer().positive().default(4000),
  MONGODB_URI: Joi.string().min(1).default("mongodb://127.0.0.1:27017/e-comm-app"),
  JWT_SECRET: Joi.string().min(16).default("e-comm-app-secret"),
  JWT_EXPIRES_IN: Joi.string().default("7d"),
  CORS_ORIGIN: Joi.string().default("*"),
  LOG_LEVEL: Joi.string()
    .valid("error", "warn", "info", "http", "verbose", "debug", "silly")
    .default("info"),
  REQUEST_LIMIT_WINDOW_MS: Joi.number().integer().positive().default(60000),
  REQUEST_LIMIT_MAX: Joi.number().integer().positive().default(100)
}).unknown(true);

const { error, value } = envSchema.validate(process.env, { abortEarly: false });

if (error) {
  const errors = error.details.map((d) => d.message).join("; ");
  throw new Error(`Invalid environment configuration: ${errors}`);
}

export const env = value as {
  NODE_ENV: "development" | "test" | "production";
  APP_NAME: string;
  PORT: number;
  MONGODB_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  CORS_ORIGIN: string;
  LOG_LEVEL: string;
  REQUEST_LIMIT_WINDOW_MS: number;
  REQUEST_LIMIT_MAX: number;
};
