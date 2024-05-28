import { getAuthSession } from '@/lib/auth';
import { GroupService } from '@/lib/services';
import logger from '@/utils/logger';
import { redirect } from 'next/navigation';
import { Sidebar } from '../../_components';

interface Props {
    params: {
        conversationId: string;
    };
    children: React.ReactNode;
}

export async function generateMetadata({ params: { conversationId } }: Props) {
    try {
        const conversation = (await GroupService.getGroupConversationById({
            conversationId: conversationId,
        })) as IGroupConversation;

        return {
            title: `${conversation.name.slice(0, 5)}... | Messenger | Handbook`,
        };
    } catch (error) {
        logger({
            message: 'Error get conversation in layout' + error,
            type: 'error',
        });
    }
}

const MessageLayout = async ({
    params: { conversationId },
    children,
}: Props) => {
    const session = await getAuthSession();
    if (!session) redirect('/auth');

    const conversation = (await GroupService.getGroupConversationById({
        conversationId: conversationId,
    })) as IGroupConversation;

    if (
        conversation.members.every(
            (member) => member.user._id !== session.user.id
        )
    ) {
        redirect('/messages');
    }

    return <>{children}</>;
};

export default MessageLayout;
