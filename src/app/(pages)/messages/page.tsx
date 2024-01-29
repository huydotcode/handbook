'use client';
import { Button, Loading } from '@/components';
import { Sidebar } from '@/components/pages/Messages';
import ChatBox from '@/components/pages/Messages/ChatBox';
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
            <div className="flex flex-col items-center justify-center w-screen h-[calc(100vh-56px)]">
                <div className="flex flex-col justify-center items-center bg-light-100 min-w-[500px] max-w-[50vw] h-[500px] rounded-xl dark:bg-dark-200">
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
            <div className="fixed top-[56px] flex justify-between w-screen h-[calc(100vh-56px)] overflow-hidden   dark:border-t dark:border-t-gray-600">
                <Sidebar />
                <ChatBox currentRoom={currentRoom} />
            </div>
        </>
    );
}

export default MessagesPage;
