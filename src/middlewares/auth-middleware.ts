import { NextFunction, Request, Response } from 'express';
import { getSession } from '../utils/get-session';

export default async function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (req.method === 'OPTIONS') {
        return next();
    }

    // const user = await getSession(req);

    // if (!user) {
    //     res.status(401).json({
    //         message: 'Unauthorized',
    //     });
    // }

    next();
}
