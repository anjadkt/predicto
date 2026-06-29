import cookieParser from 'cookie-parser';
import express from 'express'
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import serverRoutes from './routes.js'
import globelErrorHandler from './middlewares/error.middleware.js';


import type { Request, Response } from 'express';
import { env } from './config/env.js';

const app = express();

app.use(helmet());
app.use(morgan("dev"));

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