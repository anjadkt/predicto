import cookieParser from 'cookie-parser';
import express from 'express'
import helmet from 'helmet';
import morgan from 'morgan';
import serverRoutes from './routes.js'
import type { Request, Response } from 'express';

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/",( req:Request, res:Response) => { 
  res.send("Server is listening..");
});

app.use("/api", serverRoutes);

export default app ;