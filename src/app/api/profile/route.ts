import { Profile } from '@/models';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const userid = searchParams.get('userid');

    try {
        const profile = await Profile.findOne({
            user: userid,
        }).populate(
            'user',
            'name avatar givenName familyName friends followersCount followers'
        );

        return NextResponse.json({
            profile,
        });
    } catch (error) {
        return NextResponse.json({
            error: 'Lỗi lấy thông tin profile',
        });
    }
}
