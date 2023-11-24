'use client';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

interface Props {
    data: {
        id: string;
        name: string;
        avatar: string;
    };
    handleHideModal: () => void;
}

const UserItem: FC<Props> = ({ data, handleHideModal }) => {
    const { avatar, id, name } = data;

    // const addFriend = async (id: string) => {
    //   try {
    //     const response = await fetch(
    //       `/api/users/${session?.user.id}/friends/add/${user?._id}`,
    //       {
    //         method: "POST",
    //         body: JSON.stringify({
    //           type: "friend",
    //           receive: id,
    //           send: user?._id,
    //           message: "đã gửi cho bạn lời mời kết bạn",
    //         }),
    //       }
    //     );
    //     if (response.ok) {
    //     }
    //   } catch (error: any) {
    //     throw new Error(error.message);
    //   }
    // };

    // useEffect(() => {
    //   if (
    //     user?.friends.includes(session?.user.id) ||
    //     user?.following.includes(session?.user.id) ||
    //     userId === session?.user.id
    //   ) {
    //     setIsConnect(true);
    //   } else {
    //     setIsConnect(false);
    //   }
    // }, [user, userId, session?.user.id]);

    return (
        <>
            <Link
                className="relative flex items-center h-[50px] px-4 rounded-xl shadow-md mb-2 dark:bg-dark-100 dark:hover:bg-dark-200"
                href={`/profile/${id}`}
                onClick={handleHideModal}
            >
                <Image
                    className="object-cover rounded-full overflow-hidden"
                    src={avatar || ''}
                    alt={name || ''}
                    width={32}
                    height={32}
                />

                <Link
                    className="text-base text-dark-100 hover:underline ml-2 dark:text-primary"
                    href={`/profile/${id}`}
                    onClick={handleHideModal}
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
