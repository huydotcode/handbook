import jwtWebToken from 'jsonwebtoken';

export const jwt = {
    sign: (payload: any) => {
        return jwtWebToken.sign(
            payload,
            process.env.JWT_SECRET || 'any-secret',
            {
                expiresIn: '1d',
            }
        );
    },
    verify: (token: string) => {
        return jwtWebToken.verify(
            token,
            process.env.JWT_SECRET || 'any-secret'
        );
    },
};
