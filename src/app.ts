import express from 'express';
import helmet from 'helmet';
import apiRouter from './routes/api.route';
import { connectToMongo } from './services/mongodb';
import Post from './models/post.model';
import User from './models/user.model';
import Category from './models/category.model';
import Comment from './models/comment.model';
import Conversation from './models/conversation.model';
import ConversationRole from './models/conversationrole.model';
import Follows from './models/follow.model';
import Group from './models/group.model';
import Image from './models/image.model';
import Item from './models/item.model';
import Location from './models/location.model';
import Message from './models/message.model';
import Notification from './models/notification.model';
import Profile from './models/profile.model';
import SavedPost from './models/savedpost.model';

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
        methods: 'GET, POST, PUT, DELETE',
        allowedHeaders: 'Content-Type, Authorization',
    })
);
app.use(morgan('dev'));

Message.createCollection();
User.createCollection();
Post.createCollection();
Category.createCollection();
Comment.createCollection();
Conversation.createCollection();
ConversationRole.createCollection();
Follows.createCollection();
Group.createCollection();
Image.createCollection();
Item.createCollection();
Location.createCollection();
Notification.createCollection();
Profile.createCollection();
SavedPost.createCollection();

app.use('/api/v1', authMiddleware, apiRouter);

app.get('/', (req, res) => {
    res.send(`Hello world ${new Date().toISOString()}`);
});

export default app;
