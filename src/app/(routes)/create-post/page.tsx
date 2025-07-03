'use client';
import { FriendSection, Sidebar } from '@/components/layout';
import CreatePostV2 from '@/components/post/CreatePostV2';
import { useSession } from 'next-auth/react';

const CreatePostPage = () => {
    const { data: session } = useSession();

    return (
        <div className="relative top-[56px] mx-auto min-h-[calc(100vh-56px)] w-[1200px] max-w-screen md:w-screen">
            <Sidebar />

            <CreatePostV2 className="w-[650px] 2xl:w-[550px] md:w-full" />

            {session && <FriendSection session={session} />}
        </div>
    );
};

export default CreatePostPage;
