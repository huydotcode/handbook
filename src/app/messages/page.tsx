'use client';
import { Button, Loading } from '@/components/ui';
import { useSocket } from '@/context';
import { useRouter } from 'next/navigation';
import { ChatBox } from './_components';
import { useChat } from '@/context/ChatContext';

function MessagesPage() {
    const { socket, isLoading } = useSocket();
    const { currentRoom } = useChat();
    const router = useRouter();

    if (isLoading) return <Loading fullScreen />;

    if (!socket) {
        return (
            <div className="flex h-[calc(100vh-56px)] w-screen flex-col items-center justify-center">
                <div className=" flex h-[500px] min-w-[500px] max-w-[50vw] flex-col items-center justify-center rounded-xl ">
                    <h1 className="text-xl uppercase">
                        Không thể kết nối với Server
                    </h1>
                    <Button
                        className="mt-2 "
                        size="medium"
                        onClick={() => {
                            router.refresh();
                        }}
                    >
                        Kết nối lại
                    </Button>
                    <Button
                        className="mt-2  "
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
            <ChatBox currentRoom={currentRoom} />
        </>
    );
}

export default MessagesPage;
