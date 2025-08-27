import * as jwtWebToken from 'jsonwebtoken';

interface Payload {
    id: string;
    name: string;
    email: string;
    picture: string;
    role: string;
    username: string;
    iat: number;
    exp: number;
}

export const jwt = {
    sign: (payload: any) => {
        console.log('[LIB-ACTIONS] JWT sign');
        if (!payload) {
            throw new Error('Payload is required');
        }

        return jwtWebToken.sign(payload, process.env.JWT_SECRET || 'my-secret');
    },
    verify: (token: string) => {
        console.log('[LIB-ACTIONS] JWT verify');
        if (!token) {
            throw new Error('Token is required');
        }
        return jwtWebToken.verify(token, process.env.JWT_SECRET || 'my-secret');
    },
};
