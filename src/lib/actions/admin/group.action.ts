'use realtime-server';

import { Group } from '@/models';
import connectToDB from '@/services/mongoose';
import logger from '@/utils/logger';

export const getGroups = async () => {
    try {
        await connectToDB();

        const groups = await Group.find();

        return JSON.parse(JSON.stringify(groups));
    } catch (error) {
        logger({
            message: 'Error get groups' + error,
            type: 'error',
        });
    }
};
