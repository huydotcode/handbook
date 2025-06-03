import {
    getCategoriesKey,
    getCommentsKey,
    getConversationKey,
    getConversationsKey,
    getFollowersKey,
    getFriendsKey,
    getGroupsKey,
    getItemsKey,
    getLastMessagesKey,
    getLocationsKey,
    getMessagesKey,
    getNewFeedPostsKey,
    getNotificationsKey,
    getPinnedMessagesKey,
    getPostKey,
    getPostsKey,
    getProfileKey,
    getReplyCommentsKey,
    getRequestsKey,
    getSavedPostsKey,
    getSearchKey,
    getUserKey,
} from '@/lib/queryKey';
import { useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export const useQueryInvalidation = () => {
    const queryClient = useQueryClient();
    const { data: session } = useSession();

    // Các hàm invalidate cho từng loại query
    const invalidateMessages = async (conversationId: string) => {
        console.log('[LIB-HOOKS] invalidateMessages', conversationId);
        await queryClient.invalidateQueries({
            queryKey: getMessagesKey(conversationId),
        });
    };

    const queryClientAddMessage = (message: IMessage) => {
        console.log('[LIB-HOOKS] queryClientAddMessage', message);
        queryClient.setQueryData(
            getMessagesKey(message.conversation._id),
            (
                oldMessages:
                    | {
                          pages: IMessage[][];
                          pageParams: (number | undefined)[];
                      }
                    | undefined
            ) => {
                if (!oldMessages) return oldMessages;

                if (oldMessages.pages.length === 0) {
                    return {
                        pages: [[message]],
                        pageParams: [1],
                    };
                }

                const newPage = [message, ...oldMessages.pages[0]];

                console.log('NEW MESSAGES ', {
                    pages: [newPage, ...oldMessages.pages.slice(1)],
                    pageParams: oldMessages.pageParams,
                });

                return {
                    pages: [newPage, ...oldMessages.pages.slice(1)],
                    pageParams: oldMessages.pageParams,
                };
            }
        );

        queryClient.setQueryData(
            getConversationKey(message.conversation._id),
            (oldConversation: IConversation | undefined) => {
                if (!oldConversation) return oldConversation;

                return {
                    ...oldConversation,
                    lastMessage: message,
                };
            }
        );

        queryClient.setQueryData(
            getConversationsKey(session?.user.id as string),
            (oldConversations: IConversation[] | undefined | null) => {
                if (!oldConversations) return oldConversations;

                return oldConversations.map((conversation) => {
                    if (conversation._id === message.conversation._id) {
                        return {
                            ...conversation,
                            lastMessage: message,
                        };
                    }
                    return conversation;
                });
            }
        );
    };

    const queryClientAddPinnedMessage = (message: IMessage) => {
        console.log('[LIB-HOOKS] queryClientAddPinnedMessage', message);
        queryClient.setQueryData(
            getMessagesKey(message.conversation._id),
            (
                oldMessages:
                    | {
                          pages: IMessage[][];
                          pageParams: (number | undefined)[];
                      }
                    | undefined
            ) => {
                console.log({
                    oldMessages,
                    message,
                });
                if (!oldMessages) return oldMessages;

                return {
                    pages: oldMessages.pages.map((page) => {
                        return page.map((msg) => {
                            if (msg._id === message._id) {
                                console.log({
                                    msg,
                                    isPin: message.isPin,
                                });
                                return {
                                    ...msg,
                                    isPin: true,
                                };
                            }
                            return msg;
                        });
                    }),
                    pageParams: oldMessages.pageParams,
                };
            }
        );
    };

    const queryClientRemovePinnedMessage = (message: IMessage) => {
        console.log('[LIB-HOOKS] queryClientRemovePinnedMessage', message);
        queryClient.setQueryData(
            getMessagesKey(message.conversation._id),
            (
                oldMessages:
                    | {
                          pages: IMessage[][];
                          pageParams: (number | undefined)[];
                      }
                    | undefined
            ) => {
                if (!oldMessages) return oldMessages;

                return {
                    pages: oldMessages.pages.map((page) => {
                        return page.map((msg) => {
                            if (msg._id === message._id) {
                                return {
                                    ...msg,
                                    isPin: false,
                                };
                            }
                            return msg;
                        });
                    }),
                    pageParams: oldMessages.pageParams,
                };
            }
        );
    };

    const queryClientDeleteMessage = (message: IMessage) => {
        console.log('[LIB-HOOKS] queryClientDeleteMessage', message);
        queryClient.setQueryData(
            getMessagesKey(message.conversation._id),
            (
                oldMessages:
                    | {
                          pages: IMessage[][];
                          pageParams: (number | undefined)[];
                      }
                    | undefined
            ) => {
                if (!oldMessages) return oldMessages;

                const newPages = oldMessages.pages.map((page) =>
                    page.filter((msg) => msg._id !== message._id)
                );

                return {
                    pages: newPages,
                    pageParams: oldMessages.pageParams,
                };
            }
        );

        queryClient.setQueryData(
            getConversationKey(message.conversation._id),
            (oldConversation: IConversation | undefined) => {
                if (!oldConversation) return oldConversation;

                const messages = queryClient.getQueryData<{
                    pages: IMessage[][];
                    pageParams: (number | undefined)[];
                }>(getMessagesKey(message.conversation._id));

                const allMessages = messages?.pages.flat() || [];

                if (!allMessages || allMessages.length === 0) {
                    return {
                        ...oldConversation,
                        lastMessage: null,
                    };
                }

                const index = allMessages.findIndex(
                    (msg: IMessage) => msg._id === message._id
                );

                return {
                    ...oldConversation,
                    lastMessage:
                        index === -1
                            ? allMessages[0]
                            : allMessages[index - 1] ||
                              allMessages[index + 1] ||
                              null,
                };
            }
        );

        queryClient.setQueryData(
            getConversationsKey(session?.user.id as string),
            (oldConversations: IConversation[] | undefined | null) => {
                if (!oldConversations) return oldConversations;

                return oldConversations.map((conversation) => {
                    if (conversation._id === message.conversation._id) {
                        const messages = queryClient.getQueryData<{
                            pages: IMessage[][];
                            pageParams: (number | undefined)[];
                        }>(getMessagesKey(conversation._id));

                        const allMessages = messages?.pages.flat() || [];

                        if (!allMessages || allMessages.length === 0) {
                            return {
                                ...conversation,
                                lastMessage: null,
                            };
                        }

                        const index = allMessages.findIndex(
                            (msg: IMessage) => msg._id === message._id
                        );

                        return {
                            ...conversation,
                            lastMessage:
                                index === -1
                                    ? allMessages[0]
                                    : allMessages[index - 1] ||
                                      allMessages[index + 1] ||
                                      null,
                        };
                    }
                    return conversation;
                });
            }
        );
    };

    const queryClientReadMessage = (conversationId: string) => {
        console.log('[LIB-HOOKS] queryClientReadMessage', conversationId);
        queryClient.setQueryData(
            getMessagesKey(conversationId),
            (
                oldMessages:
                    | {
                          pages: IMessage[][];
                          pageParams: (number | undefined)[];
                      }
                    | undefined
            ) => {
                if (!oldMessages) return oldMessages;

                const newPage = oldMessages.pages[0].map((msg) => {
                    if (msg.isRead || msg.sender._id === session?.user.id) {
                        return msg;
                    }
                    return {
                        ...msg,
                        isRead: true,
                    };
                });

                return {
                    pages: [newPage, ...oldMessages.pages.slice(1)],
                    pageParams: oldMessages.pageParams,
                };
            }
        );
    };

    const invalidatePinnedMessages = async (conversationId: string) => {
        console.log('[LIB-HOOKS] invalidatePinnedMessages', conversationId);
        await queryClient.invalidateQueries({
            queryKey: getPinnedMessagesKey(conversationId),
        });
    };

    const invalidateConversations = async () => {
        console.log('[LIB-HOOKS] invalidateConversations');
        await queryClient.invalidateQueries({
            queryKey: getConversationsKey(session?.user.id as string),
        });
    };

    const invalidateProfile = async (userId: string) => {
        console.log('[LIB-HOOKS] invalidateProfile', userId);
        await queryClient.invalidateQueries({
            queryKey: getProfileKey(userId),
        });
    };

    const invalidateConversation = async (conversationId: string) => {
        console.log('[LIB-HOOKS] invalidateConversation', conversationId);
        await queryClient.invalidateQueries({
            queryKey: getConversationKey(conversationId),
        });
    };

    const invalidateAfterSendMessage = async (conversationId: string) => {
        console.log('[LIB-HOOKS] invalidateAfterSendMessage', conversationId);
        await queryClient.invalidateQueries({
            queryKey: getMessagesKey(conversationId),
        });
        await queryClient.invalidateQueries({
            queryKey: getConversationsKey(session?.user.id as string),
        });
        await queryClient.invalidateQueries({
            queryKey: getPinnedMessagesKey(conversationId),
        });
    };

    // Tạo các hook với các key bên dưới
    const invalidateSearch = async (q: string, type: string) => {
        console.log('[LIB-HOOKS] invalidateSearch', { q, type });
        await queryClient.invalidateQueries({
            queryKey: getSearchKey(q, type),
        });
    };

    const invalidateFollowers = async (userId: string) => {
        console.log('[LIB-HOOKS] invalidateFollowers', userId);
        await queryClient.invalidateQueries({
            queryKey: getFollowersKey(userId),
        });
    };

    const invalidateFriends = async (userId: string) => {
        console.log('[LIB-HOOKS] invalidateFriends', userId);
        await queryClient.invalidateQueries({
            queryKey: getFriendsKey(userId),
        });
    };

    const invalidateRequests = async (userId: string) => {
        console.log('[LIB-HOOKS] invalidateRequests', userId);
        await queryClient.invalidateQueries({
            queryKey: getRequestsKey(userId),
        });
    };

    const invalidateNotifications = async (userId: string) => {
        console.log('[LIB-HOOKS] invalidateNotifications', userId);
        await queryClient.invalidateQueries({
            queryKey: getNotificationsKey(userId),
        });
    };

    const invalidateGroups = async (userId: string) => {
        console.log('[LIB-HOOKS] invalidateGroups', userId);
        await queryClient.invalidateQueries({
            queryKey: getGroupsKey(userId),
        });
    };

    const invalidateNewFeedPosts = async ({
        type,
        userId,
        groupId,
        username,
    }: {
        type?: string;
        userId?: string;
        groupId?: string;
        username?: string;
    }) => {
        console.log('[LIB-HOOKS] invalidateNewFeedPosts', {
            type,
            userId,
            groupId,
            username,
        });
        await queryClient.invalidateQueries({
            queryKey: getNewFeedPostsKey(type, userId, groupId, username),
        });
    };

    const invalidatePosts = async () => {
        console.log('[LIB-HOOKS] invalidatePosts');
        await queryClient.invalidateQueries({
            queryKey: getPostsKey(),
        });
    };

    const invalidatePost = async (postId: string) => {
        console.log('[LIB-HOOKS] invalidatePost', postId);
        await queryClient.invalidateQueries({
            queryKey: getPostKey(postId),
        });
    };

    const invalidateSavedPosts = async (userId: string) => {
        console.log('[LIB-HOOKS] invalidateSavedPosts', userId);
        await queryClient.invalidateQueries({
            queryKey: getSavedPostsKey(userId),
        });
    };

    const invalidateComments = async (postId: string) => {
        console.log('[LIB-HOOKS] invalidateComments', postId);
        await queryClient.invalidateQueries({
            queryKey: getCommentsKey(postId),
        });
    };

    const invalidateReplyComments = async (commentId: string) => {
        console.log('[LIB-HOOKS] invalidateReplyComments', commentId);
        await queryClient.invalidateQueries({
            queryKey: getReplyCommentsKey(commentId),
        });
    };

    const invalidateLocations = async () => {
        console.log('[LIB-HOOKS] invalidateLocations');
        await queryClient.invalidateQueries({
            queryKey: getLocationsKey(),
        });
    };

    const invalidateCategories = async () => {
        console.log('[LIB-HOOKS] invalidateCategories');
        await queryClient.invalidateQueries({
            queryKey: getCategoriesKey(),
        });
    };

    const invalidateItems = async () => {
        console.log('[LIB-HOOKS] invalidateItems');
        await queryClient.invalidateQueries({
            queryKey: getItemsKey(),
        });
    };

    const invalidateLastMessages = async (conversationId: string) => {
        console.log('[LIB-HOOKS] invalidateLastMessages', conversationId);
        await queryClient.invalidateQueries({
            queryKey: getLastMessagesKey(conversationId),
        });
    };

    const invalidateUser = async (userId: string) => {
        console.log('[LIB-HOOKS] invalidateUser', userId);
        await queryClient.invalidateQueries({
            queryKey: getUserKey(userId),
        });
    };

    return {
        queryClientAddMessage,
        queryClientAddPinnedMessage,
        queryClientDeleteMessage,
        queryClientReadMessage,
        queryClientRemovePinnedMessage,
        invalidateMessages,
        invalidatePinnedMessages,
        invalidateConversations,
        invalidateConversation,
        invalidateProfile,
        invalidateAfterSendMessage,
        invalidateSearch,
        invalidateFollowers,
        invalidateFriends,
        invalidateRequests,
        invalidateNotifications,
        invalidateGroups,
        invalidateNewFeedPosts,
        invalidatePosts,
        invalidatePost,
        invalidateSavedPosts,
        invalidateComments,
        invalidateReplyComments,
        invalidateLocations,
        invalidateCategories,
        invalidateItems,
        invalidateLastMessages,
        invalidateUser,
    };
};
