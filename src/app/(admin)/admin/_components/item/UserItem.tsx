import Avatar from '@/components/Avatar';
import { Tooltip } from '@mui/material';
import Image from 'next/image';
import React from 'react';

interface Props {
    data: IUser;
}

const UserItem: React.FC<Props> = ({ data: user }) => {
    return (
        <Tooltip title={user.name}>
            <Avatar
                imgSrc={user.image}
                userUrl={user._id}
                alt={user.name}
                className="h-8 w-8 overflow-hidden rounded-full"
            />
        </Tooltip>
    );
};
export default UserItem;
