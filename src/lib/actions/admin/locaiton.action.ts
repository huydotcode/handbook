'use server';

import { Location } from '@/models';
import connectToDB from '@/services/mongoose';

export const createLocation = async ({
    name,
    slug,
    type,
    nameWithType,
    code,
}: {
    name: string;
    slug: string;
    type: string;
    nameWithType: string;
    code: string;
}) => {
    try {
        await connectToDB();

        const location = await Location.create({
            name,
            slug,
            type,
            nameWithType,
            code,
        });

        await location.save();

        return true;
    } catch (error) {
        console.error('Error creating location:', error);
        return false;
    }
};
