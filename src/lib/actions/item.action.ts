'use server';

import { Item } from '@/models';
import connectToDB from '@/services/mongoose';
import { CategoryService } from '@/lib/services';

// interface IItemModel {
//     name: string;
//     seller: Schema.Types.ObjectId;
//     description: string;
//     price: number;
//     image: Schema.Types.ObjectId;
//     location: string;
//     category: Schema.Types.ObjectId;
//     slug: string;
//     status: string;
//     createdAt: Date;
//     updatedAt: Date;
// }

export const createItem = async ({
    name,
    seller,
    description,
    price,
    images,
    location,
    category,
    status,
}: {
    name: string;
    seller: string;
    description: string;
    price: number;
    images: string[];
    location: string;
    category: string;
    status: string;
}) => {
    console.log('Createitem');
    try {
        await connectToDB();

        const slug = name.toLowerCase().replace(/ /g, '-') + '-' + Date.now();
        const newItem = await new Item({
            name,
            seller,
            description,
            price,
            images,
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

export const getItems = async () => {
    try {
        await connectToDB();

        const items = await Item.find({})
            .populate('category')
            .populate('seller')
            .populate('images');

        return JSON.parse(JSON.stringify(items));
    } catch (error: any) {
        throw new Error(error);
    }
};

export const getItemById = async ({ id }: { id: string }) => {
    try {
        await connectToDB();

        const item = await Item.findById(id)
            .populate('category')
            .populate('seller')
            .populate('images');

        return JSON.parse(JSON.stringify(item));
    } catch (error: any) {
        throw new Error(error);
    }
};

export const getItemsBySeller = async ({ seller }: { seller: string }) => {
    console.log('GetItemsBySeller' + seller);

    if (!seller) {
        throw new Error('Seller is required');
    }

    try {
        await connectToDB();

        const items = await Item.find({ seller })
            .populate('category')
            .populate('seller')
            .populate('images');

        return JSON.parse(JSON.stringify(items));
    } catch (error: any) {
        throw new Error(error);
    }
};

export const getItemsByCategoryId = async ({
    categoryId,
}: {
    categoryId: string;
}) => {
    try {
        await connectToDB();

        const items = await Item.find({
            category: categoryId,
        })
            .populate('category')
            .populate('seller')
            .populate('images');

        return JSON.parse(JSON.stringify(items));
    } catch (error: any) {
        throw new Error(error);
    }
};
