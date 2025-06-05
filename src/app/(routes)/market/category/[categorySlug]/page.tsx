import Item from '@/app/(routes)/market/_components/Item';
import { getCategoryBySlug } from '@/lib/actions/category.action';
import React from 'react';
import { getItemsByCategoryId } from '@/lib/actions/item.action';

interface Props {
    params: Promise<{ categorySlug: string }>;
}

const CategoryPage: React.FC<Props> = async ({ params }) => {
    const { categorySlug } = await params;
    const category = await getCategoryBySlug({
        slug: categorySlug,
    });

    if (!category) {
        return (
            <div className={'h-full min-h-screen w-full p-4'}>
                <h1 className="text-xl font-bold">Danh mục không tồn tại</h1>
            </div>
        );
    }

    const items = await getItemsByCategoryId({
        categoryId: category._id,
    });

    if (!items || items.length === 0) {
        return (
            <div className={'h-full min-h-screen w-full p-4'}>
                <h1 className="text-xl font-bold">
                    Không có mặt hàng nào thuộc danh mục {category.name}
                </h1>
            </div>
        );
    }

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
