import { NextRequest } from 'next/server';
import connectToDB from '@/services/mongoose';
import { Location } from '@/models';

export const GET = async (req: NextRequest) => {
    try {
        await connectToDB();

        const locations = await Location.find();

        return new Response(JSON.stringify(locations), { status: 200 });
    } catch (error: any) {
        return new Response(`Internal server error ${error}`, { status: 500 });
    }
};
