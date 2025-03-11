import mongoose from 'mongoose';
import { config } from '../utils/config';
import Conversation from '../models/conversation.model';
import ConversationRole from '../models/conversationrole.model';
import Follows from '../models/follow.model';
import Group from '../models/group.model';
import Image from '../models/image.model';
import Item from '../models/item.model';
import Location from '../models/location.model';
import Message from '../models/message.model';
import Notification from '../models/notification.model';
import Post from '../models/post.model';
import Profile from '../models/profile.model';
import SavedPost from '../models/savedpost.model';
import User from '../models/user.model';

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

        Conversation.createCollection();
        ConversationRole.createCollection();
        Follows.createCollection();
        Group.createCollection();
        Image.createCollection();
        Item.createCollection();
        Location.createCollection();
        Message.createCollection();
        Notification.createCollection();
        Post.createCollection();
        Profile.createCollection();
        SavedPost.createCollection();
        User.createCollection();

        isConnected = true;
    } catch (error: any) {
        console.error('Error connecting to MongoDB:', error.message);

        isConnected = false;
    }
};
