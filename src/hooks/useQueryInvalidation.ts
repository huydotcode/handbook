import queryKey from '@/lib/queryKey';
import { useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export const useQueryInvalidation = () => {
    const queryClient = useQueryClient();
    const { data: session } = useSession();

    // Các hàm invalidate cho từng loại query
    const invalidateMessages = async (conversationId: string) => {
        console.log('[LIB-HOOKS] invalidateMessages', conversationId);
        await queryClient.invalidateQueries({
            queryKey: queryKey.messages.conversationId(conversationId),
        });
    };

    const queryClientAddMessage = (message: IMessage) => {
        console.log('[LIB-HOOKS] queryClientAddMessage', message);
        queryClient.setQueryData(
            queryKey.messages.conversationId(message.conversation._id),
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
            queryKey.conversations.userId(message.conversation._id),
            (oldConversation: IConversation | undefined) => {
                if (!oldConversation) return oldConversation;

                return {
                    ...oldConversation,
                    lastMessage: message,
                };
            }
        );

        queryClient.setQueryData(
            queryKey.conversations.userId(session?.user.id as string),
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
            queryKey.messages.conversationId(message.conversation._id),
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
            queryKey.messages.conversationId(message.conversation._id),
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
            queryKey.messages.conversationId(message.conversation._id),
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
            queryKey.conversations.id(message.conversation._id),
            (oldConversation: IConversation | undefined) => {
                if (!oldConversation) return oldConversation;

                const messages = queryClient.getQueryData<{
                    pages: IMessage[][];
                    pageParams: (number | undefined)[];
                }>(queryKey.messages.conversationId(message.conversation._id));

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
            queryKey.conversations.userId(session?.user.id as string),
            (oldConversations: IConversation[] | undefined | null) => {
                if (!oldConversations) return oldConversations;

                return oldConversations.map((conversation) => {
                    if (conversation._id === message.conversation._id) {
                        const messages = queryClient.getQueryData<{
                            pages: IMessage[][];
                            pageParams: (number | undefined)[];
                        }>(queryKey.messages.conversationId(conversation._id));

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

    const queryClientReadMessage = (conversationId: string, userId: string) => {
        console.log('[LIB-HOOKS] queryClientReadMessage', conversationId);
        queryClient.invalidateQueries({
            queryKey: queryKey.messages.conversationId(conversationId),
        });

        queryClient.setQueryData(
            queryKey.conversations.userId(session?.user.id as string),
            (oldConversations: IConversation[] | undefined | null) => {
                if (!oldConversations) return oldConversations;

                return oldConversations.map((conversation) => {
                    if (conversation._id === conversationId) {
                        const user = conversation.participants.find(
                            (user) => user._id === userId
                        );

                        if (user) {
                            return {
                                ...conversation,
                                lastAccessed: new Date(),
                                readBy: conversation.lastMessage.readBy.push({
                                    user: user,
                                    readAt: new Date(),
                                }),
                            };
                        }
                    }
                    return conversation;
                });
            }
        );
    };

    const invalidatePinnedMessages = async (conversationId: string) => {
        console.log('[LIB-HOOKS] invalidatePinnedMessages', conversationId);
        await queryClient.invalidateQueries({
            queryKey: queryKey.messages.pinnedMessages(conversationId),
        });
    };

    const invalidateConversations = async () => {
        console.log('[LIB-HOOKS] invalidateConversations');
        await queryClient.invalidateQueries({
            queryKey: queryKey.conversations.userId(session?.user.id as string),
        });
    };

    const invalidateProfile = async (userId: string) => {
        console.log('[LIB-HOOKS] invalidateProfile', userId);
        await queryClient.invalidateQueries({
            queryKey: queryKey.user.profile(userId),
        });
    };

    const invalidateConversation = async (conversationId: string) => {
        console.log('[LIB-HOOKS] invalidateConversation', conversationId);
        await queryClient.invalidateQueries({
            queryKey: queryKey.conversations.id(conversationId),
        });
    };

    const invalidateAfterSendMessage = async (conversationId: string) => {
        console.log('[LIB-HOOKS] invalidateAfterSendMessage', conversationId);
        await queryClient.invalidateQueries({
            queryKey: queryKey.messages.conversationId(conversationId),
        });
        await queryClient.invalidateQueries({
            queryKey: queryKey.conversations.userId(session?.user.id as string),
        });
        await queryClient.invalidateQueries({
            queryKey: queryKey.messages.pinnedMessages(conversationId),
        });
    };

    // Tạo các hook với các key bên dưới
    const invalidateSearch = async (q: string, type: string) => {
        console.log('[LIB-HOOKS] invalidateSearch', { q, type });
        await queryClient.invalidateQueries({
            queryKey: queryKey.search({
                q,
                type,
            }),
        });
    };

    const invalidateFollowings = async (userId: string) => {
        console.log('[LIB-HOOKS] invalidateFollowings', userId);
        await queryClient.invalidateQueries({
            queryKey: queryKey.user.followings(userId),
        });
    };

    const invalidateFriends = async (userId: string) => {
        console.log('[LIB-HOOKS] invalidateFriends', userId);
        await queryClient.invalidateQueries({
            queryKey: queryKey.user.friends(userId),
        });
    };

    const invalidateRequests = async (userId: string) => {
        console.log('[LIB-HOOKS] invalidateRequests', userId);
        await queryClient.invalidateQueries({
            queryKey: queryKey.user.requests(userId),
        });
    };

    const invalidateNotifications = async (userId: string) => {
        console.log('[LIB-HOOKS] invalidateNotifications', userId);
        await queryClient.invalidateQueries({
            queryKey: queryKey.user.notifications(userId),
        });
    };

    const invalidateGroups = async (userId: string) => {
        console.log('[LIB-HOOKS] invalidateGroups', userId);
        await queryClient.invalidateQueries({
            queryKey: queryKey.user.groups(userId),
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
            queryKey: queryKey.posts.newFeed({
                type,
                userId,
                groupId,
                username,
            }),
        });
    };

    const invalidatePosts = async () => {
        console.log('[LIB-HOOKS] invalidatePosts');
        await queryClient.invalidateQueries({
            queryKey: queryKey.posts.all(),
        });
    };

    const invalidatePost = async (postId: string) => {
        console.log('[LIB-HOOKS] invalidatePost', postId);
        await queryClient.invalidateQueries({
            queryKey: queryKey.posts.id(postId),
        });
    };

    const invalidateComments = async (postId: string) => {
        console.log('[LIB-HOOKS] invalidateComments', postId);
        await queryClient.invalidateQueries({
            queryKey: queryKey.posts.comments(postId),
        });
    };

    const invalidateReplyComments = async (commentId: string) => {
        console.log('[LIB-HOOKS] invalidateReplyComments', commentId);
        await queryClient.invalidateQueries({
            queryKey: queryKey.posts.replyComments(commentId),
        });
    };

    const invalidateLocations = async () => {
        console.log('[LIB-HOOKS] invalidateLocations');
        await queryClient.invalidateQueries({
            queryKey: queryKey.locations,
        });
    };

    const invalidateCategories = async () => {
        console.log('[LIB-HOOKS] invalidateCategories');
        await queryClient.invalidateQueries({
            queryKey: queryKey.categories,
        });
    };

    const invalidateItems = async () => {
        console.log('[LIB-HOOKS] invalidateItems');
        await queryClient.invalidateQueries({
            queryKey: queryKey.items.index,
        });
    };

    const invalidateItemsBySeller = async (sellerId: string) => {
        console.log('[LIB-HOOKS] invalidateItemsBySeller', sellerId);
        await queryClient.invalidateQueries({
            queryKey: queryKey.items.bySeller(sellerId),
        });
    };

    const invalidateUser = async (userId: string) => {
        console.log('[LIB-HOOKS] invalidateUser', userId);
        await queryClient.invalidateQueries({
            queryKey: queryKey.user.id(userId),
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
        invalidateFollowings,
        invalidateFriends,
        invalidateRequests,
        invalidateNotifications,
        invalidateGroups,
        invalidateNewFeedPosts,
        invalidatePosts,
        invalidatePost,
        invalidateComments,
        invalidateReplyComments,
        invalidateLocations,
        invalidateCategories,
        invalidateItems,
        invalidateItemsBySeller,
        invalidateUser,
    };
};
