import React from 'react';
import Item from './_components/Item';
import { getItems } from '@/lib/actions/item.action';
import ListItem from './_components/ListItem';

interface Props {}

const MarketPage: React.FC<Props> = async () => {
    return (
        <div className={'h-full min-h-screen w-full p-4'}>
            <h1 className="text-xl font-bold">Các mặt hàng hôm nay</h1>

            <ListItem />
        </div>
    );
};

export default MarketPage;
