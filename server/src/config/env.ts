import {z} from "zod";

const originsSchema=z.string().default("http://localhost:5173")
  .transform(value=>value.split(",").map(origin=>origin.trim()).filter(Boolean))
  .pipe(z.array(z.string().url()).nonempty());

const envSchema=z.object({
  NODE_ENV:z.enum(["development","test","production"]).default("development"),
  PORT:z.coerce.number().int().positive().default(5000),
  MONGODB_URI:z.string().min(1).default("mongodb://127.0.0.1:27017/kenoracric"),
  JWT_ACCESS_SECRET:z.string().min(24),
  CLIENT_URL:originsSchema,
});

export const env=envSchema.parse(process.env);
