import Item from '@/app/(routes)/market/_components/Item';
import { getCategoryBySlug } from '@/lib/actions/category.action';
import React from 'react';
import { getItemsByCategoryId } from '@/lib/actions/item.action';

interface Props {
    params: {
        categorySlug: string;
    };
}

const CategoryPage: React.FC<Props> = async ({ params: { categorySlug } }) => {
    const category = await getCategoryBySlug({
        slug: categorySlug,
    });
    const items = await getItemsByCategoryId({
        categoryId: category._id,
    });

    return (
        <div className={'h-full min-h-screen w-full p-4'}>
            <h1 className="text-xl font-bold">
                Các mặt hàng thuộc danh mục {category.name}
            </h1>
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

export default CategoryPage;
