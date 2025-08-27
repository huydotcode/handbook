'use client';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { timeConvert, timeConvert3 } from '@/utils/timeConvert';
import { Avatar } from '@/components/ui';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';

interface Link {
    name: string;
    path: string;
    icon: React.ReactNode;
}

interface UserItem {
    className?: string;
    data: IUser;
    handleHideModal?: () => void;
}

interface GroupItem {
    data: IGroup;
}

interface ItemItem {
    data: IItem;
}

const Items = {
    User: ({ data, className, handleHideModal }: UserItem) => {
        const { avatar, _id, name } = data;

        return (
            <Button
                className={cn('mb-2 w-full justify-start', className)}
                onClick={() => {
                    if (handleHideModal) handleHideModal();
                }}
                variant={'default'}
                href={`/profile/${_id}`}
            >
                <Image
                    className="overflow-hidden rounded-full object-cover"
                    src={avatar || ''}
                    alt={name || ''}
                    width={32}
                    height={32}
                />

                <p className="ml-2 text-xs text-black dark:text-dark-primary-1">
                    {name}
                </p>
            </Button>
        );
    },
    Group: (props: GroupItem) => {
        const { data: group } = props;

        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            className="mb-2 flex h-14 w-full items-center justify-start"
                            variant={'default'}
                            href={`/groups/${group._id}`}
                        >
                            <Avatar
                                onlyImage
                                imgSrc={group.avatar.url}
                                alt={group.name}
                                width={32}
                                height={32}
                            />

                            <div className="ml-2 flex flex-1 flex-col">
                                <p className="max-w-[calc(100%-60px)] truncate text-sm dark:text-dark-primary-1">
                                    {group.name}
                                </p>

                                <p className="text-xs text-secondary-1">
                                    Hoạt động gần nhất:{' '}
                                    {timeConvert3(
                                        group.lastActivity.toString()
                                    )}
                                </p>
                            </div>
                        </Button>
                    </TooltipTrigger>

                    <TooltipContent>
                        <div className="flex flex-1 flex-col">
                            <p className="w-full truncate text-sm dark:text-dark-primary-1">
                                {group.name}
                            </p>

                            <p className="text-xs text-secondary-1">
                                Hoạt động gần nhất:{' '}
                                {timeConvert(group.lastActivity.toString())}
                            </p>
                        </div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    },
};

export default Items;
