import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JwtDecoded } from '../types/jwt';

export default async function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const secretKey = process.env.JWT_SECRET;

    if (!secretKey) {
        return res.status(500).json({ message: 'Internal server error' });
    }

    const decoded = jwt.verify(token, secretKey) as JwtDecoded;

    if (!decoded) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    next();
}
