'use server';

import { Group } from '@/models';
import connectToDB from '@/services/mongoose';

export const getGroups = async () => {
    try {
        await connectToDB();

        const groups = await Group.find();

        return JSON.parse(JSON.stringify(groups));
    } catch (error) {
        console.log(error);
    }
};
