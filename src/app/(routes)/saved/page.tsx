'use client';
import { FriendSection, Sidebar } from '@/components/layout';
import { InfinityPostComponent } from '@/components/post';
import { useSession } from 'next-auth/react';

const SavedPage = () => {
    const { data: session } = useSession();

    return (
        <>
            <div className="relative top-[56px] mx-auto min-h-[calc(100vh-56px)] w-[1200px] max-w-screen md:w-screen">
                <Sidebar />

                <div className="mx-auto mt-2 w-[600px] xl:w-[550px] md:w-full">
                    <h1 className="text-2xl font-bold">Bài viết đã lưu</h1>

                    <InfinityPostComponent className="mt-2" type="saved" />
                </div>

                {session && <FriendSection session={session} />}
            </div>
        </>
    );
};

export default SavedPage;
