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
    sign: (payload: Payload) => {
        return jwtWebToken.sign(
            payload,
            process.env.JWT_SECRET || 'my-secret',
            {
                expiresIn: '1d',
            }
        );
    },
    verify: (token: string) => {
        return jwtWebToken.verify(token, process.env.JWT_SECRET || 'my-secret');
    },
};
