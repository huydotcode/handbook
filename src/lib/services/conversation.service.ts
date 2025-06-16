import {
    addPinMessage,
    createConversation,
    createConversationAfterAcceptFriend,
    deleteConversation,
    deleteConversationByUserId,
    getConversationById,
    getConversationsByGroupId,
    getConversationWithTwoUsers,
    joinConversation,
    leaveConversation,
    removePinMessage,
    undeleteConversationByUserId,
} from '../actions/conversation.action';

interface ConversationService {
    getById(conversationId: string): Promise<IConversation>;
    getByGroupId(groupId: string): Promise<IConversation[]>;
    getPrivateConversation({
        userId,
        friendId,
    }: {
        userId: string;
        friendId: string;
    }): Promise<{ isNew: boolean; conversation: IConversation }>;
    create({
        creator,
        participantsUserId,
        status,
        title,
        groupId,
        type,
    }: {
        participantsUserId: string[];
        creator: string;
        title?: string;
        status?: string;
        groupId?: string | null;
        type?: string;
    }): Promise<IConversation>;
    createAfterAcceptFriend({
        userId,
        friendId,
    }: {
        userId: string;
        friendId: string;
    }): Promise<IConversation>;
    join({
        conversationId,
        userId,
    }: {
        conversationId: string;
        userId: string;
    }): Promise<void>;
    delete(conversationId: string): Promise<void>;
    deleteByUser({
        conversationId,
        userId,
    }: {
        conversationId: string;
        userId: string;
    }): Promise<void>;
    addPinMessage({
        conversationId,
        messageId,
    }: {
        conversationId: string;
        messageId: string;
    }): Promise<void>;
    removePinMessage({
        conversationId,
        messageId,
    }: {
        conversationId: string;
        messageId: string;
    }): Promise<void>;
    leaveConversation({
        conversationId,
        userId,
    }: {
        conversationId: string;
        userId: string;
    }): Promise<void>;
    undeleteConversationByUserId({
        conversationId,
        userId,
    }: {
        conversationId: string;
        userId: string;
    }): Promise<void>;
}

class ConversationServiceClass implements ConversationService {
    public async getById(conversationId: string) {
        const conversation = (await getConversationById({
            conversationId,
        })) as IConversation;

        return conversation;
    }

    public async getByGroupId(groupId: string) {
        const conversations = await getConversationsByGroupId({
            groupId,
        });

        return conversations as IConversation[];
    }

    public async getPrivateConversation({
        userId,
        friendId,
    }: {
        userId: string;
        friendId: string;
    }) {
        const { isNew, conversation } = await getConversationWithTwoUsers({
            otherUserId: friendId,
            userId,
        });

        return {
            isNew,
            conversation: conversation as IConversation,
        };
    }

    public async create({
        creator,
        participantsUserId,
        status = 'active',
        title,
        groupId = null,
        type = 'private',
    }: {
        participantsUserId: string[];
        creator: string;
        title?: string;
        status?: string;
        groupId?: string | null;
        type?: string;
    }) {
        const conversation = await createConversation({
            participantsUserId,
            creator,
            title,
            status,
            groupId,
            type,
        });

        return conversation as IConversation;
    }

    public async createAfterAcceptFriend({
        userId,
        friendId,
    }: {
        userId: string;
        friendId: string;
    }) {
        const conversation = await createConversationAfterAcceptFriend({
            userId,
            friendId,
        });

        return conversation;
    }

    public async join({
        conversationId,
        userId,
    }: {
        conversationId: string;
        userId: string;
    }) {
        await joinConversation({
            conversationId,
            userId,
        });
    }

    public async delete(conversationId: string) {
        await deleteConversation({
            conversationId,
        });
    }

    public async deleteByUser({
        conversationId,
        userId,
    }: {
        conversationId: string;
        userId: string;
    }) {
        await deleteConversationByUserId({
            conversationId,
            userId,
        });
    }

    public async addPinMessage({
        conversationId,
        messageId,
    }: {
        conversationId: string;
        messageId: string;
    }) {
        await addPinMessage({
            conversationId,
            messageId,
        });
    }

    public async removePinMessage({
        conversationId,
        messageId,
    }: {
        conversationId: string;
        messageId: string;
    }) {
        await removePinMessage({
            conversationId,
            messageId,
        });
    }

    public async leaveConversation({
        conversationId,
        userId,
    }: {
        conversationId: string;
        userId: string;
    }) {
        await leaveConversation({
            conversationId,
            userId,
        });
    }

    public async undeleteConversationByUserId({
        conversationId,
        userId,
    }: {
        conversationId: string;
        userId: string;
    }) {
        await undeleteConversationByUserId({
            conversationId,
            userId,
        });
    }
}

const ConversationService = new ConversationServiceClass();
export default ConversationService;
