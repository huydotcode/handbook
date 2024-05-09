import { getAuthSession } from '@/lib/auth';
import { ConversationService, MessageService } from '@/lib/services';
import { Session } from 'next-auth';
import { redirect } from 'next/navigation';
import { ChatBox } from '../../_components';

interface Props {
    params: {
        conversationId: string;
    };
}

const MessagePage: React.FC<Props> = async ({ params: { conversationId } }) => {
    // const session = (await getAuthSession()) as Session;
    // if (!session) redirect('/');

    // const conversation = (await ConversationService.getConversation({
    //     conversationId,
    //     conversationType: 'f',
    // })) as IPrivateConversation;

    // const friend = conversation.members.find(
    //     (member) => member._id != session.user.id
    // );

    // conversation.friend = friend as IUser;

    // if (!conversation) redirect('/messages');

    // const initialMessages = (await MessageService.getMessages({
    //     conversationId,
    //     page: 1,
    //     pageSize: 20,
    // })) as IMessage[];

    return (
        <>
            {/* <ChatBox
                conversation={conversation}
                initialMessages={initialMessages}
            /> */}
        </>
    );
};
export default MessagePage;
