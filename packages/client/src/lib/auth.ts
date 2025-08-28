import { Profile, User } from '@/models';
import connectToDB from '@/services/mongoose';
import generateUsernameFromEmail from '@/utils/generateUsernameFromEmail';
import logger from '@/utils/logger';

import bcrypt from 'bcrypt';
import { NextAuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { getServerSession } from 'next-auth/next';
import Credentials from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { jwt } from './actions/jwt';
import * as jwtWebToken from 'jsonwebtoken';

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
        maxAge: 24 * 60 * 60, // 24 hours
    },
    jwt: {
        encode({ salt, secret, maxAge, token }) {
            console.log('[LIB - AUTH] JWT encode');
            if (!token) {
                return '';
            }

            return jwtWebToken.sign(token, secret, {
                expiresIn: '1d',
            });
        },
        decode: async ({ token, salt, secret }) => {
            if (!token) {
                return null;
            }

            const decoded = jwtWebToken.decode(token) as JWT;
            if (!decoded) {
                return null;
            }

            return decoded;
        },
        secret: process.env.JWT_SECRET,
        maxAge: 24 * 60 * 60, // 24 hours
    },
    secret: process.env.JWT_SECRET,
    pages: { error: '/auth/error' },
    cookies: {
        sessionToken: {
            name: 'sessionToken',
            options: {
                httpOnly: true,
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                sameSite:
                    process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
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
                console.log('[LIB - AUTH] Authorizing user with credentials');
                try {
                    const { email, password } = credentials;
                    await connectToDB();

                    const user = await User.findOne({
                        email: email,
                    });

                    return {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                    };
                } catch (error) {
                    console.error('Authorization error:', error);
                    return null;
                }
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            console.log('[LIB - AUTH] JWT callback');
            try {
                await connectToDB();

                if (!token.email) {
                    return token;
                }

                const userExists = await User.findOne({ email: token.email });
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
            console.log('[LIB - AUTH] Session callback');
            if (token) {
                session.user.id = token.id.toString();
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.image = token.picture;
                session.user.role = token.role;
                session.user.username = token.username;
                session.user.accessToken = jwt.sign(token);
            }

            return session;
        },
        async signIn({
            profile: oAuthCredentials,
            credentials: passwordCredentials,
        }) {
            console.log('[LIB - AUTH] SignIn callback');
            try {
                await connectToDB();

                const email =
                    oAuthCredentials?.email || passwordCredentials?.email;
                if (!email) {
                    throw new Error('No email provided');
                }

                const userExists = await User.findOne({ email });
                if (!userExists && oAuthCredentials) {
                    const { email, name, picture, family_name, given_name } =
                        oAuthCredentials as OAuthCredentials;

                    const username = generateUsernameFromEmail({ email });

                    const newUser = new User({
                        email,
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

                if (userExists && passwordCredentials?.password) {
                    const isValid = await userExists.comparePassword(
                        passwordCredentials.password
                    );
                    if (!isValid) {
                        throw new Error('Invalid password');
                    }
                    return true;
                }

                return true;
            } catch (error) {
                logger({
                    message: `Error in signIn: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
