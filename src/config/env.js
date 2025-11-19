import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'change-me',
  rateLimitWindowMinutes: Number(process.env.RATE_LIMIT_WINDOW_MINUTES || 15),
  rateLimitMaxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS || 100),
  uploadDir: process.env.UPLOAD_DIR || 'uploads'
};
