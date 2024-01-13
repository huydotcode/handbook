import { Profile, User } from '@/models';
import connectToDB from '@/services/mongoose';
import { NextAuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import Credentials from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

interface Profile {
    email: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    locale: string;
    username: string;
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
        signIn: '/login',
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
                if (user) {
                    token.id = user!.id;
                }

                return token;
            }

            return {
                id: userExists._id.toString(),
                name: userExists.name,
                email: userExists.email,
                picture: userExists.image,
            };
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id.toString();
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.image = token.picture;
            }

            return session;
        },
        async signIn({ profile, credentials }) {
            try {
                await connectToDB();

                let userExists;
                let profileExists;

                if (profile) {
                    userExists = await User.findOne({
                        email: profile.email,
                    });

                    profileExists = await Profile.findOne({
                        userId: userExists?._id,
                    });
                }

                if (credentials) {
                    userExists = await User.findOne({
                        email: credentials.email,
                    });

                    profileExists = await Profile.findOne({
                        userId: userExists?._id,
                    });
                }

                if (!profileExists && userExists) {
                    const profile = await new Profile({
                        userId: userExists?._id,
                        coverPhoto: '/assets/img/cover-page.jpg',
                        bio: `Xin chào các bạn. Tôi tên ${userExists.name}`,
                        profilePicture: userExists.image,
                        username: userExists.username,
                    });

                    await profile.save();
                }

                if (!userExists) {
                    const {
                        email,
                        name,
                        given_name,
                        family_name,
                        picture,
                        locale,
                        username,
                    } = profile as Profile;

                    const user = await new User({
                        email: email,
                        name: name,
                        image: picture,
                        given_name: given_name,
                        family_name: family_name,
                        locale: locale,
                        username: username,
                    });

                    await user.save();

                    const newProfile = await new Profile({
                        userId: user?._id,
                        coverPhoto: '/assets/img/cover-page.jpg',
                        bio: `Xin chào các bạn. Tôi tên ${user.name}`,
                        profilePicture: user.image,
                        username: user.username,
                    });

                    await newProfile.save();
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
