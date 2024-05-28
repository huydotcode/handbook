import { getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Sidebar } from '../../_components';
import { ConversationService, UserService } from '@/lib/services';
import logger from '@/utils/logger';

interface Props {
    params: {
        conversationId: string;
    };
    children: React.ReactNode;
}

export async function generateMetadata({ params: { conversationId } }: Props) {
    try {
        const conversation = (await ConversationService.getConversation({
            conversationId,
            conversationType: 'f',
        })) as IPrivateConversation;

        const session = await getAuthSession();

        const friend = conversation.members.filter(
            (member) => member._id != session?.user.id
        )[0] as IUser;

        return {
            title: `${friend.name} | Messenger | Handbook`,
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
    if (!session) redirect('/');

    const friends = await UserService.getFriends({
        userId: session.user.id,
    });

    const conversation = (await ConversationService.getConversation({
        conversationId,
        conversationType: 'f',
    })) as IPrivateConversation;

    // Kiểm tra conversationId có tồn tại chuỗi sesion.user.id không ( conversationId gồm id người bạn và id của mình)
    // Nếu không thì redirect về trang messages
    if (!conversationId.includes(session.user.id)) redirect('/messages');

    return <>{children}</>;
};

export default MessageLayout;
