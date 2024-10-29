'use server';

import { Item } from '@/models';
import connectToDB from '@/services/mongoose';

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
    image,
    location,
    category,
    slug,
    status,
    images,
}: {
    name: string;
    seller: string;
    description: string;
    price: number;
    image: string;
    location: string;
    category: string;
    slug: string;
    status: string;
    images: string[];
}) => {
    try {
        await connectToDB();

        const newItem = await new Item({
            name,
            seller,
            description,
            price,
            image,
            location,
            category,
            slug,
            status,
            images,
        });

        await newItem.save();

        return JSON.parse(JSON.stringify(newItem));
    } catch (error: any) {
        throw new Error(error);
    }
};
