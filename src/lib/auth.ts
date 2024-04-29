import { Profile, User } from '@/models';
import connectToDB from '@/services/mongoose';
import generateUsernameFromEmail from '@/utils/generateUsernameFromEmail';

import { NextAuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import Credentials from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

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
    pages: {
        signIn: '/auth',
        error: '/login',
    },
    secret: process.env.JWT_SECRET,
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
            async authorize(credentials: any) {
                if (credentials) {
                    const { email, password } = credentials;

                    await connectToDB();

                    // Regex email
                    const emailRegex = new RegExp(
                        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
                    );

                    // Check email is valid?
                    const isEmail = emailRegex.test(email);
                    if (!isEmail) {
                        return {
                            then(onfulfilled, onrejected) {
                                throw new Error('Email không hợp lệ ');
                            },
                        };
                    }

                    const user = (await User.findOne({
                        email: email,
                    })) as User;

                    if (!user) {
                        return {
                            then(onfulfilled, onrejected) {
                                throw new Error('Người dùng không tồn tại');
                            },
                        };
                    }

                    const isValid = await user.comparePassword(password);
                    if (!isValid) {
                        return {
                            then(onfulfilled, onrejected) {
                                throw new Error('Mật khẩu không đúng');
                            },
                        };
                    }

                    return user;
                } else {
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            await connectToDB();

            if (!token.email) {
                return token;
            }

            const userExists = await User.findOne({ email: token.email });

            if (!userExists) {
                console.log('User not found');
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
                console.log('Error checking if user exists ');
                return false;
            }
        },
    },
};

export const getAuthSession = () => getServerSession(authOptions);
