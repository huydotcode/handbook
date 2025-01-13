'use server';

import { cookies } from 'next/headers';

export const setCookie = async (token: any) => {
    const cookieStore = await cookies();

    cookieStore.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    });
};
