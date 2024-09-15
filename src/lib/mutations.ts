'use client';

import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import CommentService from './services/comment.service';

export const useSubmitCommentMutation = ({ postId }: { postId: string }) => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: CommentService.sendComment,
        onSuccess: async (newComment: IComment) => {
            try {
                console.log('onSuccess', newComment);
                const queryKey: QueryKey = ['comments', postId];

                await queryClient.cancelQueries({ queryKey });

                queryClient.setQueryData(queryKey, (oldData: any) => {
                    const firstPage = oldData.pages[0];
                    const firstComments = firstPage.comments;

                    const newPages = oldData.pages.slice(0, -1);
                    const newComments = [...firstComments, newComment];
                    const newHasNextPage = oldData.hasNextPage;

                    return {
                        pages: [
                            ...newPages,
                            {
                                comments: newComments,
                                hasNextPage: newHasNextPage,
                            },
                        ],
                    };
                });

                queryClient.invalidateQueries({
                    queryKey,
                    predicate(query) {
                        return !query.state.data;
                    },
                });
            } catch (error: any) {
                throw new Error(error);
            }
        },
    });

    return mutation;
};
