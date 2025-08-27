import { FriendSection, Sidebar } from '@/components/layout';
import { getAuthSession } from '@/lib/auth';
import React from 'react';

interface Props {
    children: React.ReactNode;
}

const PostLayout: React.FC<Props> = async ({ children }) => {
    const session = await getAuthSession();

    if (!session) {
        return <></>;
    }

    return (
        <div>
            <Sidebar />
            {children}
            <FriendSection session={session} />
        </div>
    );
};

export default PostLayout;
