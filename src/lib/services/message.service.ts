import {
    deleteMessage,
    pinMessage,
    sendMessage,
    unPinMessage,
} from '../actions/message.action';

interface IMessageService {
    send: ({
        roomId,
        text,
        images,
    }: {
        roomId: string;
        text: string;
        images?: string[];
    }) => Promise<IMessage | null>;
    delete: ({
        messageId,
        prevMessageId,
        conversationId,
    }: {
        messageId: string;
        conversationId: string;
        prevMessageId?: string | null;
    }) => Promise<boolean>;
    pin: (messageId: string) => Promise<boolean>;
    unpin: (messageId: string) => Promise<boolean>;
}

class MessageServiceClass implements IMessageService {
    async send({
        roomId,
        text,
        images,
    }: {
        roomId: string;
        text: string;
        images?: string[];
    }): Promise<IMessage | null> {
        console.log('[LIB-SERVICES] sendMessage');
        const newMessage = await sendMessage({
            roomId,
            text,
            images,
        });

        if (!newMessage) {
            throw new Error('Error sending message');
        }

        return newMessage;
    }

    async delete({
        messageId,
        prevMessageId,
        conversationId,
    }: {
        messageId: string;
        conversationId: string;
        prevMessageId?: string | null;
    }): Promise<boolean> {
        console.log('[LIB-SERVICES] deleteMessage');
        const result = await deleteMessage({
            conversationId,
            messageId,
            prevMessageId,
        });

        if (!result) {
            throw new Error('Error deleting message');
        }

        return true;
    }

    async pin(messageId: string): Promise<boolean> {
        const result = await pinMessage({
            messageId,
        });

        if (!result) {
            throw new Error('Error pinning message');
        }

        return true;
    }

    async unpin(messageId: string): Promise<boolean> {
        const result = await unPinMessage({
            messageId,
        });

        if (!result) {
            throw new Error('Error unpinning message');
        }

        return true;
    }
}

const MessageService = new MessageServiceClass();
export default MessageService;
