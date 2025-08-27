'use client';
import { Avatar } from '@/components/ui';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { TooltipTrigger } from '@radix-ui/react-tooltip';
import { useSession } from 'next-auth/react';
interface Props {
    msg: IMessage;
    index: number;
    isOwnMsg: boolean;
    isSearchMessage?: boolean;
}

const ReadMessage = ({
    msg,
    index,
    isOwnMsg,
    isSearchMessage = false,
}: Props) => {
    const { data: session } = useSession();

    return (
        <>
            {index == 0 && !isSearchMessage && (
                <>
                    {msg.sender._id === session?.user.id &&
                        msg.conversation.type === 'private' &&
                        msg.readBy.length > 0 && (
                            <span className="text-xs text-secondary-1">
                                Đã xem
                            </span>
                        )}

                    {msg.conversation.type === 'group' &&
                        msg.readBy.length > 0 && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div
                                            className={cn(
                                                'mt-1 flex items-center gap-1',
                                                {
                                                    'flex-row-reverse':
                                                        isOwnMsg,
                                                }
                                            )}
                                        >
                                            {msg.readBy
                                                .slice(0, 5)
                                                .map((read) => (
                                                    <Avatar
                                                        key={read?.user?._id}
                                                        imgSrc={
                                                            read?.user?.avatar
                                                        }
                                                        width={16}
                                                        height={16}
                                                        onlyImage
                                                    />
                                                ))}

                                            {msg.readBy.length > 5 && (
                                                <span className="text-xs text-secondary-1">
                                                    + {msg.readBy.length - 5}
                                                </span>
                                            )}
                                        </div>
                                    </TooltipTrigger>

                                    <TooltipContent
                                        className="max-h-[200px] overflow-y-auto"
                                        side={isOwnMsg ? 'left' : 'right'}
                                        asChild
                                    >
                                        <div className="flex flex-col gap-1">
                                            {msg.readBy
                                                .slice(0, 5)
                                                .map((read) => (
                                                    <div
                                                        key={read?.user?._id}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <Avatar
                                                            imgSrc={
                                                                read?.user
                                                                    ?.avatar
                                                            }
                                                            width={16}
                                                            height={16}
                                                            onlyImage
                                                        />
                                                        <span>
                                                            {read?.user?.name}
                                                        </span>
                                                    </div>
                                                ))}

                                            {msg.readBy.length > 5 && (
                                                <span className="text-xs text-secondary-1">
                                                    + {msg.readBy.length - 5}{' '}
                                                    người khác
                                                </span>
                                            )}
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                </>
            )}
        </>
    );
};

export default ReadMessage;
