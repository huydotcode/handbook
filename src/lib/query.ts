import { QueryClient } from '@tanstack/react-query';
import { getLastMessagesKey, getMessagesKey } from './queryKey';

export const invalidateMessages = (
    queryClient: QueryClient,
    conversationId: string
) => {
    queryClient.invalidateQueries({
        queryKey: getMessagesKey(conversationId),
    });

    queryClient.invalidateQueries({
        queryKey: getLastMessagesKey(conversationId),
    });
};
