'use client';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

interface Props {
    data: IUser;
    handleHideModal: () => void;
}

const UserItem: FC<Props> = ({ data, handleHideModal }) => {
    const { image, _id, name } = data;

    return (
        <>
            <Link
                className="relative mb-2 flex h-[50px] items-center rounded-xl px-4 shadow-md dark:bg-dark-100 dark:hover:bg-dark-200"
                href={`/profile/${_id}`}
                onClick={handleHideModal}
            >
                <Image
                    className="overflow-hidden rounded-full object-cover"
                    src={image || ''}
                    alt={name || ''}
                    width={32}
                    height={32}
                />

                <Link
                    className="ml-2 text-base text-dark-100 hover:underline dark:text-primary"
                    href={`/profile/${_id}`}
                >
                    {name}
                </Link>
            </Link>
        </>
    );
};

export default UserItem;
