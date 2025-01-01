import { getAuthSession } from '@/lib/auth';
import { POPULATE_USER } from '@/lib/populate';
import { User } from '@/models';
import connectToDB from '@/services/mongoose';
import { NextResponse } from 'next/server';

export const GET = async (req: Request) => {
    try {
        const session = await getAuthSession();
        if (!session) {
            return NextResponse.json({
                status: 401,
                body: {
                    error: 'Unauthorized',
                },
            });
        }

        await connectToDB();

        const user = await User.findById(session.user.id)
            .select('friends')
            .populate('friends', POPULATE_USER);

        if (!user) {
            return NextResponse.json(
                {
                    error: 'User not found',
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                friends: user.friends,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return NextResponse.json(
            {
                error: 'Internal server error',
            },
            {
                status: 500,
            }
        );
    }
};
