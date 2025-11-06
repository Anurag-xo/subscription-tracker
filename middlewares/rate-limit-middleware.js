import rateLimit from "express-rate-limit";
import { createRedisStore } from "rate-limit-redis";
import redis from "redis";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each user to 100 requests per window
  keyGenerator: (req) => req.user?.id || req.ip,
  standardHeaders: true,
  legacyHeaders: false,
});

export default limiter;
