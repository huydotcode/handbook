import express from 'express';
import helmet from 'helmet';
import apiRouter from './routes/api.route';
import { connectToMongo } from './services/mongodb';
import Post from './models/post.model';
import User from './models/user.model';
import cors from 'cors';
import authMiddleware from './middlewares/auth-middleware';

const morgan = require('morgan');

const app = express();

connectToMongo();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());

app.use(
    cors({
        origin: ['http://localhost:3000', 'https://handbookk.vercel.app'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    })
);
app.use(morgan('dev'));
app.use('/api/v1', authMiddleware, apiRouter);

app.get('/', (req, res) => {
    res.send('Hello World 10.14');
});

export default app;
