import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwt } from './lib/jwt';

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('next-auth.session-token');

    if (!token) {
        return NextResponse.redirect(new URL('/auth/login', req.nextUrl));
    }

    const tokenValue = token.value || '';

    if (!tokenValue) {
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
