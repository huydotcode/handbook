import mongoose from 'mongoose';
import Category from '../models/category.model';
import Conversation from '../models/conversation.model';
import ConversationRole from '../models/conversationrole.model';
import Follows from '../models/follow.model';
import Group from '../models/group.model';
import Item from '../models/item.model';
import Location from '../models/location.model';
import Media from '../models/media.model';
import Message from '../models/message.model';
import Notification from '../models/notification.model';
import Post from '../models/post.model';
import Profile from '../models/profile.model';
import User from '../models/user.model';
import { config } from '../utils/config';

let isConnected = false;

export const connectToMongo = async () => {
    if (isConnected) return;

    try {
        if (!config.mongodbUri) {
            throw new Error('MongoDB URI is not defined');
        }

        await mongoose.connect(config.mongodbUri, {
            autoCreate: true,
            autoIndex: true,
        });
        console.log('Connected to MongoDB');

        await Conversation.createCollection();
        await ConversationRole.createCollection();
        await Follows.createCollection();
        await Group.createCollection();
        await Media.createCollection();
        await Item.createCollection();
        await Location.createCollection();
        await Message.createCollection();
        await Notification.createCollection();
        await Post.createCollection();
        await Profile.createCollection();
        await User.createCollection();
        await Category.createCollection();

        isConnected = true;
    } catch (error: any) {
        console.error('Error connecting to MongoDB:', error.message);

        isConnected = false;
    }
};
