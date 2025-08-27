'use client';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { FC, useCallback, useState } from 'react';

import { Modal } from '../ui';
import CreatePostV2 from './CreatePostV2';

interface Props {
    groupId?: string;
    type?: 'default' | 'profile' | 'group';
}

const CreatePost: FC<Props> = ({ groupId, type = 'default' }) => {
    const { data: session } = useSession();

    const [show, setShow] = useState(false);

    const handleClose = useCallback(() => setShow(false), []);
    const handleShow = useCallback(() => setShow(true), []);

    return (
        <>
            <div className="mb-4 rounded-xl bg-white px-4 py-2 shadow-md transition-all duration-300 ease-in-out dark:bg-dark-secondary-1">
                <div className="flex items-center">
                    <Link
                        className="h-10 w-10"
                        href={`/profile/${session?.user.id}`}
                    >
                        {session?.user && (
                            <Image
                                className="h-full w-full rounded-full object-cover"
                                width={40}
                                height={40}
                                src={session.user.image || ''}
                                alt={session.user.name || ''}
                            />
                        )}
                    </Link>
                    <div
                        className="ml-3 flex h-10 flex-1 cursor-text items-center rounded-xl bg-primary-1 px-3 dark:bg-dark-secondary-2"
                        onClick={handleShow}
                    >
                        <h5 className="text-secondary-1">
                            {type === 'group'
                                ? `Đăng bài lên nhóm này...`
                                : `Bạn đang nghĩ gì?`}
                        </h5>
                    </div>
                </div>
            </div>

            {show && (
                <Modal
                    handleClose={handleClose}
                    show={show}
                    title="Đăng bài viết"
                >
                    <CreatePostV2
                        className="w-[600px] max-w-full"
                        variant="modal"
                        onSubmitSuccess={handleClose}
                        groupId={groupId}
                        hasMenu={false}
                    />
                </Modal>
            )}
        </>
    );
};

export default CreatePost;
