export type JwtDecoded = {
    id: string;
    name: string;
    email: string;
    picture: string;
    role: 'user' | 'admin';
    username: string;
    iat: number;
};
