'use server';

import { Group } from '@/models';
import connectToDB from '@/services/mongoose';
import logger from '@/utils/logger';

export const getGroups = async () => {
    console.log('[LIB-ACTIONS] getGroups');
    try {
        await connectToDB();

        const groups = await Group.find()
            .populate('avatar')
            .populate('creator')
            .populate('members.user');

        return JSON.parse(JSON.stringify(groups));
    } catch (error) {
        logger({
            message: 'Error get groups' + error,
            type: 'error',
        });
    }
};
