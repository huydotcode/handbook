import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const token = await getToken({ req });

    if (!token) {
        return NextResponse.redirect(new URL('/auth', req.nextUrl));
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
// '/:path*'
export const config = {
    matcher: [
        '/',
        '/groups/:path*',
        '/market/:path*',
        '/profile/:path*',
        '/messages/:path*',
        '/posts/:path*',
    ],
};
