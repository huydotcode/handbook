'use client';

import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import CommentService from './services/comment.service';

export const useSubmitCommentMutation = ({ postId }: { postId: string }) => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: CommentService.sendComment,
        onSuccess: async (newComment: IComment) => {
            const queryKey: QueryKey = ['comments', postId];

            await queryClient.cancelQueries({ queryKey });

            queryClient.setQueryData(queryKey, (oldData: any) => {
                return {
                    pageParams: oldData.pageParams,
                    pages: [
                        [newComment, ...oldData.pages[0]],
                        ...oldData.pages.slice(1),
                    ],
                };
            });

            queryClient.invalidateQueries({
                queryKey,
                predicate(query) {
                    return !query.state.data;
                },
            });
        },
    });

    return mutation;
};
