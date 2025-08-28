import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JwtDecoded } from '../types/jwt';
import { UserRole } from '../enums/UserRole';

export default async function adminMiddlware(
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

    if (decoded.role !== UserRole.ADMIN) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    next();
}
