import ListItem from '@/app/(routes)/market/_components/ListItem';
import React from 'react';
import { getAuthSession } from '@/lib/auth';
import { notFound } from 'next/navigation';
import { getItemsBySeller } from '@/lib/actions/item.action';
import Item from '@/app/(routes)/market/_components/Item';

const ManageItemPage = async () => {
    const session = await getAuthSession();

    if (!session) notFound();

    const items = await getItemsBySeller({ seller: session.user.id });

    return (
        <div className={'h-full min-h-screen w-full p-4'}>
            <h1 className="text-xl font-bold">Các mặt hàng của bạn</h1>

            <div
                className={
                    'grid grid-cols-3 gap-2 xl:grid-cols-2 lg:grid-cols-1'
                }
            >
                {items.map((item, index) => (
                    <Item data={item} key={item._id} isManage />
                ))}
            </div>
        </div>
    );
};

export default ManageItemPage;
