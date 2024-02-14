import React from 'react';

interface Props {}

const ChatItem: React.FC<Props> = ({}) => {
    return (
        <Button
            className={cn(
                'relative flex w-full justify-start rounded-none p-4 shadow-none md:justify-center md:p-2',
                isSelect && 'bg-primary-1'
            )}
            key={friend._id}
            href={`/messages/f/${friend._id}`}
        >
            <Image
                className="rounded-full"
                priority={true}
                src={friend.image}
                alt={friend.name}
                width={32}
                height={32}
            />

            <span className="absolute right-4 top-2 ml-2 hidden text-xs md:block">
                <Icons.Circle
                    className={`${isOnline ? 'text-blue-600' : 'text-secondary-1'}`}
                />
            </span>

            <div className="flex flex-col md:hidden">
                <div className="flex items-center justify-between">
                    <h3 className="ml-2 whitespace-nowrap text-sm font-bold">
                        {friend.name}
                    </h3>
                    <span className="ml-2 text-xs">
                        <Icons.Circle
                            className={`${isOnline ? 'text-blue-600' : 'text-secondary-1'}`}
                        />
                    </span>
                </div>
                <p className="ml-2 text-xs ">
                    {lastMsg?.text && lastMsg?.userId == session?.user.id
                        ? 'Bạn: '
                        : `${friendName}: `}
                    {lastMsg?.text || 'Chưa có tin nhắn'}
                </p>
            </div>
        </Button>
    );
};
export default ChatItem;
