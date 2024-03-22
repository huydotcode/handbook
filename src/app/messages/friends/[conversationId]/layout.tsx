import { getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

interface Props {
    params: {
        conversationId: string;
    };
    children: React.ReactNode;
}

const MessageLayout = async ({
    params: { conversationId },
    children,
}: Props) => {
    const session = await getAuthSession();
    if (!session) redirect('/');

    // Kiểm tra conversationId có tồn tại chuỗi sesion.user.id không ( conversationId gồm id người bạn và id của mình)
    // Nếu không thì redirect về trang messages
    if (!conversationId.includes(session.user.id)) redirect('/messages');

    return <>{children}</>;
};

export default MessageLayout;
