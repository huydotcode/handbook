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
    try {
        await connectToDB();

        const slug = name.toLowerCase().replace(/ /g, '-');

        /*
        * name: string;
    seller: Schema.Types.ObjectId;
    description: string;
    price: number;
    images: Schema.Types.ObjectId[];
    location: string;
    category: Schema.Types.ObjectId;
    slug: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
        * */
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
