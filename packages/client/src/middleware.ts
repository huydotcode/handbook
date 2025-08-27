import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('sessionToken')?.value;

    if (!token) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/groups/:path*',
        '/market/:path*',
        '/messages/:path*',
        '/posts/:path*',
        '/profile/:path*',
        '/saved/:path*',
        '/search/:path*',
        '/admin/:path*',
    ],
};
