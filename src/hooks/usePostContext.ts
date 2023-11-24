import { PostContext } from '@/context/PostContext';
import { useContext } from 'react';

export default function usePostContext() {
    return useContext(PostContext) as IPostContext;
}
