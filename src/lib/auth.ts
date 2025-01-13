import { Profile, User } from '@/models';
import connectToDB from '@/services/mongoose';
import generateUsernameFromEmail from '@/utils/generateUsernameFromEmail';
import logger from '@/utils/logger';

import bcrypt from 'bcrypt';
import { NextAuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import Credentials from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { jwt } from './jwt';

interface OAuthCredentials {
    iss: string;
    azp: string;
    aud: string;
    sub: string;
    email: string;
    email_verified: boolean;
    at_hash: string;
    name: string;
    picture: string;
    given_name: string;
    family_name: string;
    locale: string;
    iat: number;
    exp: number;
}

interface FormBasedCredentials {
    email: string;
    password: string;
    redirect: string;
    csrfToken: string;
    callbackUrl: string;
    json: string;
}

function getGoogleCredentials() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || clientId.length === 0) {
        throw new Error('Missing GOOGLE_CLIENT_ID');
    }

    if (!clientSecret || clientSecret.length === 0) {
        throw new Error('Missing GOOGLE_CLIENT_SECRET');
    }

    return { clientId, clientSecret };
}

export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt',
    },
    secret: process.env.JWT_SECRET,
    cookies: {
        sessionToken: {
            name: 'next-auth.session-token',
            options: {
                httpOnly: true,
                path: '/',
            },
        },
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        encode: async ({ secret, token, maxAge, salt }) => {
            console.log('encode');
            /*
                {
                    secret: '0xLCQbkPJPNXlG0K5E4Q2sXFD+fhsQR+cV5UCzdkps=',
                    token: {
                        id: '65f98b41a1fb29ea5968a4ca',
                        name: 'Ngô Nhựt Huy 1',
                        email: 'ngonhuthuy@gmail.com',
                        picture: '/assets/img/user-profile.jpg',
                        role: 'user',
                        username: 'ngonhuthuy'
                    },
                    maxAge: 2592000,
                    salt: undefined
                }
            */
            // console.log('encode result', jwt.sign(token));
            return jwt.sign(token);
        },
        decode: async ({ secret, token, salt }) => {
            console.log('decode');
            if (!token) return null;
            // console.log('decode result', jwt.verify(token));
            /*
            {
                id: '65f98b41a1fb29ea5968a4ca',
                name: 'Ngô Nhựt Huy 1',
                email: 'ngonhuthuy@gmail.com',
                picture: '/assets/img/user-profile.jpg',
                role: 'user',
                username: 'ngonhuthuy',
                iat: 1736756401,
                exp: 1736842801
            }
            */
            return jwt.verify(token) as any;
        },
        maxAge: 60 * 60 * 24,
    },
    providers: [
        GoogleProvider({
            clientId: getGoogleCredentials().clientId,
            clientSecret: getGoogleCredentials().clientSecret,
        }),
        Credentials({
            credentials: {
                username: {},
                password: {},
            },
            authorize: async function (credentials: any) {
                console.log('AUTHORIZE');
                try {
                    const { email, password } = credentials;

                    await connectToDB();

                    return await User.findOne({ email });
                } catch (error) {
                    console.error('Authorization error:', error);
                    return null;
                }
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user, account, profile, session, trigger }) {
            console.log('JWT');

            /*
             token: {
                id: '65f98b41a1fb29ea5968a4ca',
                name: 'Ngô Nhựt Huy 1',
                email: 'ngonhuthuy@gmail.com',
                picture: '/assets/img/user-profile.jpg',
                role: 'user',
                username: 'ngonhuthuy',
                iat: 1736756401,
                exp: 1736842801
            },
            user: undefined,
            account: undefined,
            profile: undefined,
            session: undefined,
            trigger: undefined
            */

            await connectToDB();

            if (!token.email) {
                return token;
            }

            const userExists = await User.findOne({ email: token.email });

            if (!userExists) {
                logger({
                    message: 'Error user exists',
                    type: 'error',
                });
                return {
                    id: '',
                    name: '',
                    email: '',
                    picture: '',
                    role: 'user',
                    username: '',
                };
            }

            /*
                 name: 'Ngô Nhựt Huy 1',
                email: 'ngonhuthuy@gmail.com',
                picture: undefined,
                sub: '65f98b41a1fb29ea5968a4ca'
            */

            return {
                id: userExists._id.toString(),
                name: userExists.name,
                email: userExists.email,
                picture: userExists.avatar,
                role: userExists.role,
                username: userExists.username,
            };
        },
        async session({ session, token, newSession, trigger, user }) {
            console.log('SESSION');
            if (token) {
                session.user.id = token.id.toString();
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.image = token.picture;
                session.user.role = token.role;
                session.user.username = token.username;
            }

            return session;
        },
        async signIn({
            profile: oAuthCredentials,
            credentials: passwordcredentials,
        }) {
            console.log('SIGN IN');
            try {
                await connectToDB();

                const isHaveAccount = async ({ email }: { email: string }) => {
                    if (email.length === 0) return null;

                    const userExits = await User.findOne({
                        email: email,
                    });

                    return userExits;
                };

                const email =
                    (oAuthCredentials?.email as string) ||
                    (passwordcredentials?.email as string) ||
                    ('' as string);

                const userExists = await isHaveAccount({
                    email: email || '',
                });

                if (!userExists && oAuthCredentials) {
                    const { email, name, picture, family_name, given_name } =
                        oAuthCredentials as OAuthCredentials;

                    const username = generateUsernameFromEmail({ email });

                    const newUser = new User({
                        email: email,
                        name,
                        avatar: picture,
                        familyName: family_name,
                        givenName: given_name,
                        username,
                    });

                    await newUser.save();

                    const profile = new Profile({
                        user: newUser._id,
                        coverPhoto: '',
                        bio: '',
                        work: '',
                        education: '',
                        location: '',
                        dateOfBirth: new Date(),
                    });

                    await profile.save();
                    return true;
                }

                if (userExists && passwordcredentials) {
                    // Đăng nhập với email và password
                    const password = passwordcredentials.password as string;

                    const isValid = await userExists.comparePassword(password);

                    if (!isValid) {
                        return false;
                    }

                    return true;
                }

                return true;
            } catch (error) {
                logger({
                    message: 'Error signin auth' + error,
                    type: 'error',
                });
                return false;
            }
        },
    },
};

export const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

export const getAuthSession = () => getServerSession(authOptions);
