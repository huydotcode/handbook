import Profile from '@/models/Profile';
import User from '@/models/User';
import connectToDB from '@/services/mongoose';
import bcrypt from 'bcrypt';

const saltRounds = 10;

export const POST = async (req: Request, res: Response) => {
    console.log('API - POST: SIGN UP');
    const request = await req.json();

    const { email, name, password, repassword, username } = request;

    try {
        await connectToDB();

        const userExists = await User.findOne({ email: email });

        if (userExists) {
            return new Response(
                JSON.stringify({
                    msg: 'Email đã tồn tại',
                })
            );
        }

        // hash password
        const salt = await bcrypt.genSalt(saltRounds);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = await new User({
            name: name,
            email: email,
            username: username,
            password: hashPassword,
            image: request.image || '/assets/img/user-profile.jpg',
        });

        const newProfile = await new Profile({
            userId: newUser._id,
            coverPhoto: '/assets/img/cover-page.jpg',
            bio: `Xin chào các bạn. Tôi tên ${newUser.name}`,
            profilePicture: newUser.image,
            username: username,
        });

        await newProfile.save();
        await newUser.save();

        return new Response(JSON.stringify({ msg: 'Đăng ký thành công' }), {
            status: 200,
        });
    } catch (error) {
        return new Response(
            JSON.stringify({ msg: 'Đăng ký thất bại', error }),
            {
                status: 500,
            }
        );
    }
};
