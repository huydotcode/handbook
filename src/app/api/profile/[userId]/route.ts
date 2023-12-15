import Profile from '@/models/Profile';
import logger from '@/utils/logger';

export const GET = async (request: Request, { params }: IParams) => {
    logger('API - GET: Get Profile');
    const { userId } = params;

    try {
        const profile = await Profile.findOne({
            userId,
        });

        return new Response(JSON.stringify(profile), {
            status: 200,
        });
    } catch (error) {
        return new Response('Failed to get profile', {
            status: 400,
        });
    }
};

export const PATCH = async (req: Request, { params }: IParams) => {
    const request = await req.json();
    const { userId } = params;

    const { newBio } = request;

    try {
        await Profile.updateOne({ userId: userId }, { bio: newBio });

        return new Response('Success', {
            status: 200,
        });
    } catch (error) {
        return new Response('Failed to update bio', {
            status: 400,
        });
    }
};
