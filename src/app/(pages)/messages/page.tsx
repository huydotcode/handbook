import { Sidebar } from '@/components/pages/Messages';
import ChatBox from '@/components/pages/Messages/ChatBox';

function MessagesPage() {
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
