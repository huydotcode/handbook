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

export const updateGroupsCoverPhoto = async () => {
    try {
        await connectToDB();

        // add field coverPhoto to Group model
        await Group.updateMany(
            {},
            { coverPhoto: '/assets/img/cover-page.jpg' }
        );
    } catch (error) {
        console.log(error);
    }
};
