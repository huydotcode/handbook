import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(async function middleware(req) {}, {
    callbacks: {
        async authorized() {
            return true;
        },
    },
});

export const config = {
    matchter: ['/:path*', '/login'],
};
