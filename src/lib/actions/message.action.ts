'use server';
import Message from '@/models/Message';
import connectToDB from '@/services/mongoose';

export const fetchMessagesByRoomId = async ({ roomId }: { roomId: string }) => {
    if (roomId.trim().length === 0) throw new Error('Đã có lỗi xảy ra');

    try {
        await connectToDB();

        const messages = await Message.find({
            roomId: roomId,
        });

        return JSON.parse(JSON.stringify(messages));
    } catch (error) {}
};

export const sendMessage = async ({
    roomId,
    text,
    userId,
}: {
    roomId: string;
    text: string;
    userId: string;
}) => {
    try {
        await connectToDB();

        const msg = new Message({
            userId: userId,
            roomId: roomId,
            text: text,
            isRead: false,
        });

        await msg.save();

        return JSON.parse(JSON.stringify(msg));
    } catch (error) {
        console.log(error);
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

// fetch last message
export const fetchLastMessage = async ({ roomId }: { roomId: string }) => {
    try {
        await connectToDB();

        const message = await Message.findOne({
            roomId: roomId,
        }).sort({ createdAt: -1 });

        return JSON.parse(JSON.stringify(message));
    } catch (error: any) {
        throw new Error(error);
    }
};
