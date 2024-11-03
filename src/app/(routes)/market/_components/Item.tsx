'use client';
import { useSession } from 'next-auth/react';
import { Dropdown, MenuProps } from 'antd';
import { Button, Icons } from '@/components/ui';
import Image from 'next/image';
import React, { useEffect } from 'react';
import Link from 'next/link';

interface Props {
    data: IItem;
}

const Item: React.FC<Props> = ({ data: item }) => {
    const { data: session } = useSession();
    if (!session) return null;

    const items: MenuProps['items'] = [
        // {
        //     key: '1',
        //     label: <Link href={`/items/${item.slug}`}>Xem sản phẩm</Link>,
        //     icon: <Icons.Eye />,
        // },
        {
            key: '2',
            label: <Link href={`/items/${item.slug}/edit`}>Chỉnh sửa</Link>,
            icon: <Icons.Edit />,
        },
        {
            key: '3',
            label: <Link href={`/items/${item.slug}/delete`}>Xóa</Link>,
            icon: <Icons.Delete />,
        },
    ];

    return (
        <Dropdown
            trigger={['click', 'hover']}
            menu={{ items }}
            placement="bottomCenter"
            autoFocus
        >
            <Button
                variant={'custom'}
                className="flex w-full cursor-pointer items-center justify-between px-2 py-1 text-sm shadow-sm hover:bg-hover-1 dark:hover:bg-dark-hover-1 lg:w-auto lg:justify-center"
                key={item._id}
            >
                <div className="flex items-center lg:h-8 lg:w-8">
                    <Image
                        className="rounded-full"
                        src={item.images[0].url || ''}
                        alt={item.name || ''}
                        width={32}
                        height={32}
                    />

                    <span className="ml-2 text-xs lg:hidden">{item.name}</span>
                </div>

                <span className="lg:hidden">
                    <span className="text-xs text-secondary-1">
                        {item.category.name}
                    </span>
                </span>
            </Button>
        </Dropdown>
    );
};

export default Item;
