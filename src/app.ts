import express from 'express';
import helmet from 'helmet';
import apiRouter from './routes/api.route';
import { connectToMongo } from './services/mongodb';
import Post from './models/post.model';
import User from './models/user.model';
import cors from 'cors';

const morgan = require('morgan');

const app = express();

connectToMongo();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());

app.use(
    cors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: 'Content-Type,Authorization',
    })
);
app.use(morgan('dev'));
app.use('/api/v1', apiRouter);

app.get('/', (req, res) => {
    res.send('Hello World 10.14');
});

export default app;
