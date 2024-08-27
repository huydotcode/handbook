import { CategoryService } from '@/lib/services';
import React from 'react';
import CreateCategory from './_components/CreateCategory';

const MarketAdminPage = async () => {
    const categories = await CategoryService.getCategories();

    return (
        <div>
            {categories.map((cate: any) => (
                <div>{cate.name}</div>
            ))}

            <CreateCategory />
        </div>
    );
};

export default MarketAdminPage;
