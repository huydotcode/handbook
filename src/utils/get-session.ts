import { Request } from 'express';
import { jwt } from './jwt';

export const getSession = async (req: Request) => {
    const cookies = req.headers.cookie;

    if (!cookies) return null;

    const token = cookies.split(';')[2].split('=')[1];
    const user = await jwt.verify(token);

    return user;
};
