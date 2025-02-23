import { NextFunction, Request, Response } from 'express';
import { jwt } from '../utils/jwt';

export default async function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (req.method === 'OPTIONS') {
        return next();
    }

    const sessionToken = req.cookies.sessionToken;

    if (!sessionToken) {
        return res.status(401).json({
            message: 'Unauthorized! Not session token found',
            cookies: req.cookies,
        });
    }

    if (!process.env.JWT_SECRET) {
        return res.status(500).json({
            message: 'Unauthorized! Not jwt secret found',
        });
    }

    const token = jwt.verify(sessionToken);

    if (!token) {
        return res.status(401).json({
            message: 'Unauthorized! Invalid session token',
        });
    }

    next();
}
