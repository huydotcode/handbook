import express from 'express';
import helmet from 'helmet';
import apiRouter from './routes/api.route';
import { connectToMongo } from './services/mongodb';
import Post from './models/post.model';
import User from './models/user.model';
import cors from 'cors';
import authMiddleware from './middlewares/auth-middleware';
import cookieParser from 'cookie-parser';

const morgan = require('morgan');

const app = express();

connectToMongo();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
app.use(
    cors({
        origin: ['http://localhost:3000', 'https://handbookk.vercel.app'],
        credentials: true,
    })
);
app.use(morgan('dev'));
app.use('/api/v1', authMiddleware, apiRouter);

app.get('/', (req, res) => {
    res.send(`Hello world ${new Date().toISOString()}`);
});

export default app;
