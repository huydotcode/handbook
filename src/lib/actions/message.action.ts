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
            { lastMessage: prevMessageId }
        );

        return true;
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

        return true;
    } catch (error: any) {
        throw new Error(error);
    }
};
