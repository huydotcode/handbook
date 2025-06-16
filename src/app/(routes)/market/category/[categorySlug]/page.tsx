import CategoryService from '@/lib/services/category.service';
import ItemService from '@/lib/services/item.service';
import React from 'react';
import ListItem from '../../_components/ListItem';

interface Props {
    params: Promise<{ categorySlug: string }>;
}

const CategoryPage: React.FC<Props> = async ({ params }) => {
    const { categorySlug } = await params;
    const category = await CategoryService.getBySlug(categorySlug);

    if (!category) {
        return (
            <div className={'h-full min-h-screen w-full p-4'}>
                <h1 className="text-xl font-bold">Danh mục không tồn tại</h1>
            </div>
        );
    }

    const items = await ItemService.getItemsByCategoryId(category._id);

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
        <div>
            <h1 className="text-xl font-bold">
                Các mặt hàng thuộc danh mục {category.name}
            </h1>

            <ListItem data={items} />
        </div>
    );
};

export default CategoryPage;
