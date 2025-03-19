import { Profile } from '@/models';
import { NextResponse, type NextRequest } from 'next/server';
import { POPULATE_USER } from '@/lib/populate';

type Params = Promise<{ req: NextRequest }>;

export async function GET(req: NextRequest, segmentData: { params: Params }) {
    const searchParams = await req.nextUrl.searchParams;
    const userid = searchParams.get('userid');

    try {
        const profile = await Profile.findOne({
            user: userid,
        }).populate('user', POPULATE_USER);

        return NextResponse.json(profile, {
            status: 200,
        });
    } catch (error) {
        return NextResponse.json({
            error: 'Lỗi lấy thông tin profile',
        });
    }
}
