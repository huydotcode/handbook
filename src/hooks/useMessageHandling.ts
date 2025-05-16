import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useMessages } from '@/app/(routes)/messages/_components/ChatBox';

export const useMessageHandling = (conversationId: string) => {
    const [isFind, setIsFind] = useState(false);
    const {
        data: messages,
        fetchNextPage,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
    } = useMessages(conversationId);

    const handleFindMessage = useCallback(
        async (messageId: string) => {
            if (!messageId || !messages) return;

            const foundMessage = messages.find((msg) => msg._id === messageId);
            if (foundMessage) {
                const element = document.getElementById(messageId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                } else {
                    const observer = new MutationObserver(() => {
                        const newElement = document.getElementById(messageId);
                        if (newElement) {
                            newElement.scrollIntoView({
                                behavior: 'smooth',
                                block: 'center',
                            });
                            observer.disconnect();
                        }
                    });
                    observer.observe(document.body, {
                        childList: true,
                        subtree: true,
                    });
                }
                setIsFind(true);
                return;
            }

            if (hasNextPage) {
                await fetchNextPage();
            }

            if (!hasNextPage) {
                toast.error('Không tìm thấy tin nhắn', {
                    position: 'top-center',
                });
            }
        },
        [messages, fetchNextPage, hasNextPage]
    );

    return {
        messages,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        isFind,
        setIsFind,
        handleFindMessage,
        fetchNextPage,
    };
};
