'use server';
import { Conversation, Message } from '@/models';
import connectToDB from '@/services/mongoose';
import logger from '@/utils/logger';
import { getAuthSession } from '../auth';

/*
    * Message Model: 
    text: string;
    media: Types.ObjectId[];
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
    console.log('[LIB-ACTIONS] getMessageByMessageId');
    try {
        await connectToDB();

        const message = await Message.findById(messageId)
            .populate('sender', POPULATE_USER)
            .populate('conversation')
            .populate('media');

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
    console.log('[LIB-ACTIONS] getMessagesWithConversationId');
    if (conversationId.trim().length === 0) throw new Error('Đã có lỗi xảy ra');

    try {
        await connectToDB();

        const messages = await Message.find({
            conversation: conversationId,
        })
            .populate('sender', POPULATE_USER)
            .populate('conversation')
            .populate('media')
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
    console.log('[LIB-ACTIONS] sendMessage');
    try {
        await connectToDB();

        const session = await getAuthSession();
        if (!session) throw new Error('Đã có lỗi xảy ra');

        const msg = new Message({
            text,
            media: images,
            sender: session.user.id,
            conversation: roomId,
        });

        await msg.save();

        const message = await Message.findById(msg._id)
            .populate('sender', POPULATE_USER)
            .populate('conversation')
            .populate('media')
            .populate('readBy.user', POPULATE_USER);

        await Conversation.updateOne(
            { _id: roomId },
            {
                lastMessage: msg._id,
                updatedAt: new Date(),
            }
        );

        return JSON.parse(JSON.stringify(message));
    } catch (error) {
        logger({
            message: 'Error send messsage' + error,
            type: 'error',
        });
    }
};

export const deleteMessage = async ({
    messageId,
    prevMessageId,
    conversationId,
}: {
    messageId: string;
    conversationId: string;
    prevMessageId?: string | null;
}) => {
    console.log('[LIB-ACTIONS] deleteMessage');
    try {
        await connectToDB();

        await Message.findByIdAndDelete(messageId);

        await Conversation.updateOne(
            {
                _id: conversationId,
            },
            { lastMessage: messageId }
        );

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
    console.log('[LIB-ACTIONS] getMessages');
    try {
        await connectToDB();

        const messages = await Message.find({
            conversation: conversationId,
        })
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .populate('sender', POPULATE_USER)
            .populate('conversation')
            .populate('media')
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
    console.log('[LIB-ACTIONS] getLastMessageByCoversationId');
    try {
        await connectToDB();

        const message = await Message.findOne({
            conversation: conversationId,
        })
            .populate('sender', POPULATE_USER)
            .populate('conversation')
            .populate('media')
            .sort({ createdAt: -1 });

        return JSON.parse(JSON.stringify(message));
    } catch (error: any) {
        throw new Error(error);
    }
};

export const pinMessage = async ({ messageId }: { messageId: string }) => {
    console.log('[LIB-ACTIONS] pinMessage');
    try {
        await connectToDB();

        await Message.findOneAndUpdate(
            {
                _id: messageId,
            },
            {
                isPin: true,
            }
        );

        return true;
    } catch (error: any) {
        throw new Error(error);
    }
};

export const unPinMessage = async ({ messageId }: { messageId: string }) => {
    console.log('[LIB-ACTIONS] unPinMessage');
    try {
        await connectToDB();

        await Message.findOneAndUpdate(
            {
                _id: messageId,
            },
            {
                isPin: false,
            }
        );
    } catch (error: any) {
        throw new Error(error);
    }
};
