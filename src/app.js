import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import { apiRateLimiter } from './middleware/rateLimiter.js';
import routes from './routes/index.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(apiRateLimiter);

app.use('/uploads', express.static(path.join(__dirname, '..', env.uploadDir)));
app.use('/api', routes);
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

export default app;
