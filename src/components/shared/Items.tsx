'use client';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { timeConvert } from '@/utils/timeConvert';

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

                <p className="ml-2 text-base text-black dark:text-dark-primary-1">
                    {name}
                </p>
            </Button>
        );
    },
    Group: (props: GroupItem) => {
        const { data: group } = props;
        return (
            <Button
                className="mb-2 w-full justify-start"
                variant={'default'}
                href={`/groups/${group._id}`}
            >
                <div className="relative h-8 w-8">
                    <Image
                        className="overflow-hidden rounded-full object-cover"
                        src={group.avatar || ''}
                        alt={group.name || ''}
                        fill
                    />
                </div>

                <div className="ml-2 flex flex-1 flex-col">
                    <p className="text-sm dark:text-dark-primary-1 md:hidden">
                        {group.name}
                    </p>

                    <p className="text-xs text-secondary-1 lg:hidden">
                        Lần hoạt động gần nhất:{' '}
                        {timeConvert(group.lastActivity.toString())}
                    </p>
                </div>
            </Button>
        );
    },
};

export default Items;
