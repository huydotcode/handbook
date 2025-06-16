'use server';
import { Item } from '@/models';
import connectToDB from '@/services/mongoose';
import { revalidatePath } from 'next/cache';
import { getAuthSession } from '../auth';

export const createItem = async ({
    name,
    seller,
    description,
    price,
    imagesIds,
    location,
    category,
    status,
}: {
    name: string;
    seller: string;
    description: string;
    price: number;
    imagesIds: string[];
    location: string;
    category: string;
    status: string;
}) => {
    console.log('[LIB-ACTIONS] createItem');
    try {
        await connectToDB();

        const session = await getAuthSession();
        if (!session) throw new Error('Đã có lỗi xảy ra');

        const slug = name.toLowerCase().replace(/ /g, '-') + '-' + Date.now();
        const newItem = await new Item({
            name,
            seller,
            description,
            price,
            images: imagesIds,
            location,
            category,
            slug,
            status,
        });

        await newItem.save();

        return JSON.parse(JSON.stringify(newItem));
    } catch (error: any) {
        throw new Error(error);
    }
};

export const getItemById = async ({ id }: { id: string }) => {
    console.log('[LIB-ACTIONS] getItemById');
    try {
        await connectToDB();

        const item = await Item.findById(id)
            .populate('category')
            .populate('seller')
            .populate('location')
            .populate('images');

        return JSON.parse(JSON.stringify(item));
    } catch (error: any) {
        throw new Error(error);
    }
};

export const getItemsBySeller = async ({ seller }: { seller: string }) => {
    console.log('[LIB-ACTIONS] getItemsBySeller');
    if (!seller) {
        throw new Error('Seller is required');
    }

    try {
        await connectToDB();

        const items = await Item.find({ seller })
            .populate('category')
            .populate('seller')
            .populate('location')
            .populate('images');

        return JSON.parse(JSON.stringify(items)) as IItem[];
    } catch (error: any) {
        throw new Error(error);
    }
};

export const getItemsByCategoryId = async ({
    categoryId,
}: {
    categoryId: string;
}) => {
    console.log('[LIB-ACTIONS] getItemsByCategoryId');
    try {
        await connectToDB();

        const items = await Item.find({
            category: categoryId,
        })
            .populate('category')
            .populate('seller')
            .populate('location')
            .populate('images');

        return JSON.parse(JSON.stringify(items));
    } catch (error: any) {
        throw new Error(error);
    }
};

export const updateItem = async ({
    itemId,
    name,
    description,
    price,
    imagesIds,
    location,
    category,
    status,
    path,
}: {
    itemId: string;
    name: string;
    description: string;
    price: number;
    imagesIds: string[];
    location: string;
    category: string;
    status: string;
    path: string;
}) => {
    console.log('[LIB-ACTIONS] updateItem');
    try {
        await connectToDB();

        const session = await getAuthSession();
        if (!session) throw new Error('Đã có lỗi xảy ra');

        await Item.updateOne(
            {
                _id: itemId,
                seller: session.user.id,
            },
            {
                name,
                description,
                price,
                images: imagesIds,
                location,
                category,
                status,
            }
        );

        revalidatePath(path);

        return true;
    } catch (error: any) {
        throw new Error(error);
    }
};

export const deleteItem = async ({
    itemId,
    path,
}: {
    itemId: string;
    path: string;
}) => {
    console.log('[LIB-ACTIONS] deleteItem');
    try {
        await connectToDB();

        await Item.findByIdAndDelete(itemId);

        revalidatePath(path);

        return true;
    } catch (error: any) {
        throw new Error(error);
    }
};
