'use client';

import React from 'react';
import Item from './Item';
import { cn } from '@/lib/utils';

interface Props {
    className?: string;
    itemClassName?: string;
    data: IItem[];
    isManage?: boolean;
}

const ListItem: React.FC<Props> = ({
    className = '',
    itemClassName,
    data,
    isManage = false,
}) => {
    return (
        <div
            className={cn(
                'grid grid-cols-4 gap-2 2xl:grid-cols-3 xl:grid-cols-2 md:grid-cols-1',
                className
            )}
        >
            {data.map((item: IItem) => (
                <Item
                    data={item}
                    key={item._id}
                    isManage={isManage}
                    className={itemClassName}
                />
            ))}
        </div>
    );
};

export default ListItem;
