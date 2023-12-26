'use client';
import React, { useState } from 'react';

export const PostContext = React.createContext<null>(null);

interface Props {
    to: string;
    children: React.ReactNode;
}

interface ICommentState {
    comments: Comment[];
    countAllComments: number;
    countAllParentComments: number;
}

function MessageProvider({ to, children }: Props) {
    const [messages, setMessages] = useState<IMessage[]>();

    return <PostContext.Provider value={null}>{children}</PostContext.Provider>;
}

export default MessageProvider;
