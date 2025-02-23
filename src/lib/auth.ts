import { Profile, User } from '@/models';
import connectToDB from '@/services/mongoose';
import generateUsernameFromEmail from '@/utils/generateUsernameFromEmail';
import logger from '@/utils/logger';

import bcrypt from 'bcrypt';
import { NextAuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import Credentials from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { jwt } from './actions/jwt';

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
    pages: { error: '/auth/error' },
    jwt: {
        secret: process.env.JWT_SECRET,
        encode: async ({ secret, token, maxAge, salt }) => {
            return jwt.sign(token);
        },
        decode: async ({ secret, salt, token }) => {
            return jwt.verify(token || '') as any;
        },
        maxAge: 30, // 30 seconds
    },
    cookies: {
        sessionToken: {
            name: 'sessionToken',
            options: {
                httpOnly: true,
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                sameSite:
                    process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                // 30s
                expires: new Date(Date.now() + 30 * 1000),
                domain: '',
            },
        },
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
        async jwt({ token, user }) {
            try {
                await connectToDB();

                if (!token.email) {
                    return token;
                }

                const userExists =
                    (await User.findOne({ email: token.email })) || null;

                if (!userExists) {
                    return {
                        id: '',
                        name: '',
                        email: '',
                        picture: '',
                        role: 'user',
                        username: '',
                    };
                }

                return {
                    id: userExists._id.toString(),
                    name: userExists.name,
                    email: userExists.email,
                    picture: userExists.avatar,
                    role: userExists.role || 'user',
                    username: userExists.username,
                };
            } catch (error: any) {
                return {
                    id: '',
                    name: '',
                    email: '',
                    picture: '',
                    role: 'user',
                    username: '',
                };
            }
        },
        async session({ session, token }) {
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
