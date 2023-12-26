import { Sidebar } from '@/components/pages/Messages';
import ChatBox from '@/components/pages/Messages/ChatBox';
import ChatProvider from '@/context/ChatContext';

function MessagesPage() {
    return (
        <ChatProvider>
            <div className="fixed top-[56px] flex justify-between w-full h-[calc(100vh-56px)] overflow-hidden dark:border-t dark:border-t-gray-600 sm:flex-col">
                <Sidebar />
                <ChatBox />
            </div>
        </ChatProvider>
    );
}

export default MessagesPage;
