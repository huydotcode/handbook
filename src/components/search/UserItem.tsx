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
                className="relative flex items-center h-[50px] px-4 rounded-xl shadow-md mb-2 dark:bg-dark-100 dark:hover:bg-dark-200"
                href={`/profile/${_id}`}
                onClick={handleHideModal}
            >
                <Image
                    className="object-cover rounded-full overflow-hidden"
                    src={image || ''}
                    alt={name || ''}
                    width={32}
                    height={32}
                />

                <Link
                    className="text-base text-dark-100 hover:underline ml-2 dark:text-primary"
                    href={`/profile/${_id}`}
                >
                    {name}
                </Link>
            </Link>

            {/* {!user && isLoading && (
        <div className="relative flex items-center h-[50px] px-4 rounded-xl shadow-md mb-2 dark:bg-dark-100 dark:hover:bg-dark-200">
          <div className="object-cover rounded-full overflow-hidden">
            <div className="w-8 h-8 bg-dark-500 animate-skeleton"></div>
          </div>

          <div className="text-base text-primary hover:underline ml-2">
            <div className="w-12 h-4 bg-dark-500 animate-skeleton rounded-xl"></div>
          </div>
        </div>
      )} */}
        </>
    );
};

export default UserItem;
