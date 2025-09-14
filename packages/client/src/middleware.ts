import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('sessionToken')?.value;
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth');

    // Nếu đang ở trang auth và có token, redirect về home
    if (isAuthPage && token) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    // Nếu không ở trang auth và không có token, redirect về login
    if (!isAuthPage && !token) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/auth/:path*',
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
