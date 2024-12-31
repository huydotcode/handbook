import React from 'react';
import Item from './_components/Item';
import { getItems } from '@/lib/actions/item.action';

interface Props {}

const MarketPage: React.FC<Props> = async () => {
    const items = await getItems();

    return (
        <div className={'h-full min-h-screen w-full p-4'}>
            <h1 className="text-xl font-bold">Các mặt hàng hôm nay</h1>
            <div
                className={
                    'grid grid-cols-4 gap-2 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1'
                }
            >
                {items.map((item: IItem) => (
                    <Item data={item} key={item._id} />
                ))}
            </div>
        </div>
    );
};

export default MarketPage;
