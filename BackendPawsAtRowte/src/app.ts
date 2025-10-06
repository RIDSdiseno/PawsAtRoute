// src/app.ts
import fs from "fs";
import path from "path";
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';           // 👈
import routes from './routes.js';
import { env } from './config/env.js';
import { errorHandler } from './middlewares/error.middleware.js';
export const app = express();

const up = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(up)) fs.mkdirSync(up, { recursive: true });


app.use(cors({
    origin: '*',
    methods: ['GET','POST','PUT','DELETE'],
    allowedHeaders: ['Content-Type','Authorization']
}));

app.use("/uploads", express.static(up));


app.use(cookieParser());                             // 👈 DEBE ir antes de las rutas
app.use(express.json());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api', routes);    
// debug opcional de cookies:
app.get('/debug/cookies', (req, res) => res.json({ cookies: (req as any).cookies }));

app.use(errorHandler);
