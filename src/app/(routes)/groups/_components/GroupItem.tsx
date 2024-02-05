import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface Props {
    data: IGroup;
}

const GroupItem: React.FC<Props> = ({ data: group }) => {
    return (
        <Link className="flex" href={`/groups/${group._id}`}>
            <div className="mr-2">
                <Image
                    alt={group.name}
                    src={group.image || '/assets/img/group-avatar.jpg'}
                    width={40}
                    height={40}
                    quality={100}
                />
            </div>

            <div className="flex flex-col justify-center">
                <span className="text-sm font-semibold">{group.name}</span>
                <span className="text-xs">
                    {group.members.length} thành viên
                </span>
            </div>
        </Link>
    );
};
export default GroupItem;
