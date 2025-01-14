import { Request } from 'express';
import { jwt } from './jwt';

interface User {
    id: string;
    name: string;
    email: string;
    picture: string;
    role: string;
    username: string;
    iat: number;
    exp: number;
}

export const getSession = async (req: Request) => {
    const cookies = req.headers.cookie;
    if (!cookies) return null;

    const token = cookies
        .split(';')
        .filter((cookie) => cookie.includes('session-token'))[0]
        .split('=')[1];
    if (!token) return null;

    const user = jwt.verify(token);
    if (!user) return null;

    return user;
};
