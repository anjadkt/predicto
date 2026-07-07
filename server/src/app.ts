import cookieParser from 'cookie-parser';
import express from 'express'
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import serverRoutes from './routes'
import globelErrorHandler from './middlewares/error.middleware';
import globalRateLimit from './middlewares/limit.middleware'


import type { Request, Response } from 'express';
import { env } from './config/env';

const app = express();

app.set("trust proxy", 1);

app.use(helmet());
app.use(morgan("dev"));
app.use(globalRateLimit(10,100));

app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("Server is listening..");
});

app.use("/api", serverRoutes);

app.use(globelErrorHandler)

export default app;