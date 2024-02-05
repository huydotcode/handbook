'use client';
import { Button, Loading } from '@/components';
import { Sidebar } from '@/app/messages/_components';
import ChatBox from '@/app/messages/_components/ChatBox';
import { useChat } from '@/context/ChatContext';
import { useSocket } from '@/context/SocketContext';
import { useRouter } from 'next/navigation';

function MessagesPage() {
    const { socket, isLoading } = useSocket();
    const { currentRoom } = useChat();
    const router = useRouter();

    if (isLoading) return <Loading fullScreen />;

    if (!socket) {
        return (
            <div className="flex h-[calc(100vh-56px)] w-screen flex-col items-center justify-center">
                <div className="flex h-[500px] min-w-[500px] max-w-[50vw] flex-col items-center justify-center rounded-xl bg-light-100 dark:bg-dark-200">
                    <h1 className="text-xl uppercase">
                        Không thể kết nối với Server
                    </h1>
                    <Button
                        className="mt-2 dark:bg-dark-500"
                        size="medium"
                        onClick={() => {
                            router.refresh();
                        }}
                    >
                        Kết nối lại
                    </Button>
                    <Button
                        className="mt-2 bg-primary text-white"
                        size="medium"
                        onClick={() => {
                            router.push('/');
                        }}
                    >
                        Trở về trang chủ
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="fixed top-[56px] flex h-[calc(100vh-56px)] w-screen justify-between overflow-hidden   dark:border-t dark:border-t-gray-600">
                <Sidebar />
                <ChatBox currentRoom={currentRoom} />
            </div>
        </>
    );
}

export default MessagesPage;
