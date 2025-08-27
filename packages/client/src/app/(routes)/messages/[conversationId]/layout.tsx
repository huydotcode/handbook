import { getAuthSession } from '@/lib/auth';
import ConversationService from '@/lib/services/conversation.service';
import React from 'react';

interface Props {
    params: Promise<{ conversationId: string }>;
    children: React.ReactNode;
}

export async function generateMetadata({ params }: Props) {
    try {
        const { conversationId } = await params;
        const conversation = await ConversationService.getById(conversationId);
        const session = await getAuthSession();

        if (!conversation) {
            return {
                title: 'Messenger | Handbook',
            };
        }

        const type = conversation.type; // Remove optional chaining

        if (type === 'group') {
            const name = conversation.title || 'Nhóm chat';

            return {
                title: `${name} | Messenger`,
                description: `Group conversation in Handbook Messenger`,
                openGraph: {
                    title: `${name} | Messenger`,
                    description: `Group conversation in Handbook Messenger`,
                },
            };
        } else if (type === 'private') {
            const name =
                conversation?.participants.find(
                    (member) => member._id !== session?.user.id
                )?.name || 'Messenger';

            return {
                title: `${name} | Messenger`,
            };
        }

        return {
            title: 'Messenger | Handbook',
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {
            title: 'Messenger | Handbook',
            description: 'An error occurred while loading the conversation',
        };
    }
}

const MessageLayout: React.FC<Props> = async ({ children }: Props) => {
    return <>{children}</>;
};
export default MessageLayout;
