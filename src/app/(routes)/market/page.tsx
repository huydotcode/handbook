import { Container } from '@/components/layout';
import ItemService from '@/lib/services/item.service';
import React from 'react';
import Item from './_components/Item';

interface Props {}

const MarketPage: React.FC<Props> = async () => {
    const items = await ItemService.getItems();

    return (
        <div className={'h-full w-full bg-secondary-1 pl-2 pt-2'}>
            <h1 className={'text-xl font-bold'}>Mặt hàng đang bán</h1>
            {items.map((item: IItem) => (
                <Item data={item} key={item._id} />
            ))}
        </div>
    );
};

export default MarketPage;
