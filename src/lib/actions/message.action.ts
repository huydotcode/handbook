'use realtime-server';
import { Message } from '@/models';
import connectToDB from '@/services/mongoose';
import logger from '@/utils/logger';
import { getAuthSession } from '../auth';

/*
    * Message Model: 
    text: string;
    images: Types.ObjectId[];
    sender: Types.ObjectId;
    conversation: string;
    isRead: boolean;
*/

const POPULATE_USER = 'name avatar username';

export const getMessageByMessageId = async ({
    messageId,
}: {
    messageId: string;
}) => {
    try {
        await connectToDB();

        const message = await Message.findById(messageId)
            .populate('sender', POPULATE_USER)
            .populate('conversation')
            .populate('images');

        return JSON.parse(JSON.stringify(message));
    } catch (error) {
        logger({
            message: 'Error get message by message id' + error,
            type: 'error',
        });
    }
};

export const getMessagesWithConversationId = async ({
    conversationId,
    page,
    pageSize,
}: {
    conversationId: string;
    page: number;
    pageSize: number;
}) => {
    if (conversationId.trim().length === 0) throw new Error('Đã có lỗi xảy ra');

    try {
        await connectToDB();

        const messages = await Message.find({
            conversation: conversationId,
        })
            .populate('sender', POPULATE_USER)
            .populate('conversation')
            .populate('images')
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .sort({ createdAt: 1 });

        return JSON.parse(JSON.stringify(messages));
    } catch (error) {
        logger({
            message: 'Error get messages with conversation id' + error,
            type: 'error',
        });
    }
};

export const sendMessage = async ({
    roomId,
    text,
    images = [],
}: {
    roomId: string;
    text: string;
    images?: string[];
}) => {
    try {
        await connectToDB();

        const session = await getAuthSession();
        if (!session) throw new Error('Đã có lỗi xảy ra');

        const msg = new Message({
            text,
            images,
            sender: session.user.id,
            conversation: roomId,
        });

        await msg.save();

        const message = await Message.findById(msg._id)
            .populate('sender', POPULATE_USER)
            .populate('conversation')
            .populate('images');

        return JSON.parse(JSON.stringify(message));
    } catch (error) {
        logger({
            message: 'Error send messsage' + error,
            type: 'error',
        });
    }
};

export const deleteMessage = async ({ messageId }: { messageId: string }) => {
    try {
        await connectToDB();

        await Message.findByIdAndDelete(messageId);

        return true;
    } catch (error: any) {
        throw new Error(error);
    }
};

export const getMessages = async ({
    page,
    pageSize,
    conversationId,
}: {
    conversationId: string;
    page: number;
    pageSize: number;
}) => {
    try {
        await connectToDB();

        const messages = await Message.find({
            conversation: conversationId,
        })
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .populate('sender', POPULATE_USER)
            .populate('conversation')
            .populate('images')
            .sort({ createdAt: -1 });

        return JSON.parse(JSON.stringify(messages));
    } catch (error: any) {
        throw new Error(error);
    }
};

export const getLastMessageByCoversationId = async ({
    conversationId,
}: {
    conversationId: string;
}) => {
    try {
        await connectToDB();

        const message = await Message.findOne({
            conversation: conversationId,
        })
            .populate('sender', POPULATE_USER)
            .populate('conversation')
            .populate('images')
            .sort({ createdAt: -1 });

        return JSON.parse(JSON.stringify(message));
    } catch (error: any) {
        throw new Error(error);
    }
};
