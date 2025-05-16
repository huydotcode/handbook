import {
    getCategoriesKey,
    getCommentsKey,
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
        await queryClient.invalidateQueries({
            queryKey: getMessagesKey(conversationId),
        });
    };

    const invalidatePinnedMessages = async (conversationId: string) => {
        await queryClient.invalidateQueries({
            queryKey: getPinnedMessagesKey(conversationId),
        });
    };

    const invalidateConversations = async () => {
        await queryClient.invalidateQueries({
            queryKey: getConversationsKey(session?.user.id as string),
        });
    };

    const invalidateProfile = async (userId: string) => {
        await queryClient.invalidateQueries({
            queryKey: getProfileKey(userId),
        });
    };

    const invalidateConversation = async (conversationId: string) => {
        await queryClient.invalidateQueries({
            queryKey: getMessagesKey(conversationId),
        });
    };

    const invalidateAfterSendMessage = async (conversationId: string) => {
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
        await queryClient.invalidateQueries({
            queryKey: getSearchKey(q, type),
        });
    };

    const invalidateFollowers = async (userId: string) => {
        await queryClient.invalidateQueries({
            queryKey: getFollowersKey(userId),
        });
    };

    const invalidateFriends = async (userId: string) => {
        await queryClient.invalidateQueries({
            queryKey: getFriendsKey(userId),
        });
    };

    const invalidateRequests = async (userId: string) => {
        await queryClient.invalidateQueries({
            queryKey: getRequestsKey(userId),
        });
    };

    const invalidateNotifications = async (userId: string) => {
        await queryClient.invalidateQueries({
            queryKey: getNotificationsKey(userId),
        });
    };

    const invalidateGroups = async (userId: string) => {
        await queryClient.invalidateQueries({
            queryKey: getGroupsKey(userId),
        });
    };

    const invalidateNewFeedPosts = async (
        type: string | undefined,
        userId: string | undefined,
        groupId: string | undefined,
        username: string | undefined
    ) => {
        await queryClient.invalidateQueries({
            queryKey: getNewFeedPostsKey(type, userId, groupId, username),
        });
    };

    const invalidatePosts = async () => {
        await queryClient.invalidateQueries({
            queryKey: getPostsKey(),
        });
    };

    const invalidatePost = async (postId: string) => {
        await queryClient.invalidateQueries({
            queryKey: getPostKey(postId),
        });
    };

    const invalidateSavedPosts = async (userId: string) => {
        await queryClient.invalidateQueries({
            queryKey: getSavedPostsKey(userId),
        });
    };

    const invalidateComments = async (postId: string) => {
        await queryClient.invalidateQueries({
            queryKey: getCommentsKey(postId),
        });
    };

    const invalidateReplyComments = async (commentId: string) => {
        await queryClient.invalidateQueries({
            queryKey: getReplyCommentsKey(commentId),
        });
    };

    const invalidateLocations = async () => {
        await queryClient.invalidateQueries({
            queryKey: getLocationsKey(),
        });
    };

    const invalidateCategories = async () => {
        await queryClient.invalidateQueries({
            queryKey: getCategoriesKey(),
        });
    };

    const invalidateItems = async () => {
        await queryClient.invalidateQueries({
            queryKey: getItemsKey(),
        });
    };

    const invalidateLastMessages = async (conversationId: string) => {
        await queryClient.invalidateQueries({
            queryKey: getLastMessagesKey(conversationId),
        });
    };

    const invalidateUser = async (userId: string) => {
        await queryClient.invalidateQueries({
            queryKey: getUserKey(userId),
        });
    };

    return {
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
