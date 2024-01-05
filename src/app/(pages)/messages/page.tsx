'use client';
import { Sidebar } from '@/components/pages/Messages';
import ChatBox from '@/components/pages/Messages/ChatBox';
import { useSocket } from '@/context/SocketContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

function MessagesPage() {
    const { socket } = useSocket();
    const router = useRouter();

    useEffect(() => {
        if (!socket) {
            toast.error('Đã xảy ra lỗi, tự động trở về trang chủ!');
            router.push('/');
        }
    }, []);

    return (
        <>
            <div className="fixed top-[56px] flex justify-between w-screen h-[calc(100vh-56px)] overflow-hidden   dark:border-t dark:border-t-gray-600">
                <Sidebar />
                <ChatBox />
            </div>
        </>
    );
}

export default MessagesPage;
