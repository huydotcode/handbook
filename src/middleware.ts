import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
    const cookies = req.cookies;
    const sessionToken = cookies.get('sessionToken')?.value;

    if (!sessionToken) {
        return NextResponse.redirect(new URL('/auth/login', req.nextUrl));
    }

    return NextResponse.next();
}

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
