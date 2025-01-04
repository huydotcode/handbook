import { Profile } from '@/models';
import { NextResponse, type NextRequest } from 'next/server';

type Params = Promise<{ req: NextRequest }>;

export async function GET(req: NextRequest, segmentData: { params: Params }) {
    const searchParams = await req.nextUrl.searchParams;
    const userid = searchParams.get('userid');

    try {
        const profile = await Profile.findOne({
            user: userid,
        }).populate(
            'user',
            'name avatar givenName familyName friends followersCount followers'
        );

        return NextResponse.json(profile, {
            status: 200,
        });
    } catch (error) {
        return NextResponse.json({
            error: 'Lỗi lấy thông tin profile',
        });
    }
}
