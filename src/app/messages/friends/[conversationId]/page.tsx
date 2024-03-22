import { getAuthSession } from '@/lib/auth';
import {
    ConversationService,
    MessageService,
    UserService,
} from '@/lib/services';
import { Session } from 'next-auth';
import { redirect } from 'next/navigation';
import { ChatBox, Sidebar } from '../../_components';

interface Props {
    params: {
        conversationId: string;
    };
}

const MessagePage: React.FC<Props> = async ({ params: { conversationId } }) => {
    const session = (await getAuthSession()) as Session;
    if (!session) redirect('/');

    const conversation = (await ConversationService.getConversation({
        conversationId,
        conversationType: 'f',
    })) as IPrivateConversation;

    const friends = await UserService.getFriends({
        userId: session.user.id,
    });

    const friend = conversation.members.find(
        (member) => member._id != session.user.id
    );

    conversation.friend = friend as IUser;

    if (!conversation) redirect('/messages');

    const initialMessages = (await MessageService.getMessages({
        conversationId,
        page: 1,
        pageSize: 20,
    })) as IMessage[];

    return (
        <>
            <Sidebar currentConversation={conversation} friends={friends} />
            <div className="w-[80%]">
                <ChatBox
                    conversation={conversation}
                    initialMessages={initialMessages}
                />
            </div>
        </>
    );
};
export default MessagePage;
