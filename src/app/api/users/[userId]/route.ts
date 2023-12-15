import User from '@/models/User';
import logger from '@/utils/logger';

export async function GET(request: Request, { params }: IParams) {
    logger('API - GET: Get user data');
    const { userId } = params;

    if (!userId) {
        return new Response('Invalid user id', { status: 500 });
    }

    try {
        const user = await User.findById(userId);

        return new Response(JSON.stringify(user), { status: 200 });
    } catch (error) {
        return new Response('Failed to get post', {
            status: 500,
        });
    }
}
