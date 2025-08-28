import { Profile, User } from '@/models';
import connectToDB from '@/services/mongoose';
import logger from '@/utils/logger';
import bcrypt from 'bcrypt';

const saltRounds = 10;

type Params = Promise<{ req: Request }>;

export async function POST(req: Request, segmentData: { params: Params }) {
    const request = await req.json();
    const { email, username, name, password, repassword, image } =
        request as any;

    try {
        await connectToDB();

        const userExists = await User.findOne({
            $or: [{ email: email }, { username: username }],
        });

        // Kiểm tra email hoặc tên đăng nhập đã tồn tại chưa!
        if (userExists) {
            return new Response(
                JSON.stringify({
                    msg: 'Email hoặc tên đăng nhập đã tồn tại! Vui lòng thử lại',
                    success: false,
                })
            );
        }

        // Kiểm tra mật khẩu nhập lại có khớp không!
        if (password !== repassword) {
            return new Response(
                JSON.stringify({
                    msg: 'Mật khẩu không khớp',
                    success: false,
                })
            );
        }

        const salt = await bcrypt.genSalt(saltRounds);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = await new User({
            name: name,
            email: email,
            username: username,
            password: hashPassword,
            avatar: image || '/assets/img/user-profile.jpg',
        });

        const newProfile = await new Profile({
            user: newUser._id,
            coverPhoto: '/assets/img/cover-page.jpg',
            bio: '',
            work: '',
            education: '',
            location: '',
            dateOfBirth: new Date(),
        });

        await newProfile.save();
        await newUser.save();

        return new Response(
            JSON.stringify({ msg: 'Đăng ký thành công', success: true }),
            {
                status: 200,
            }
        );
    } catch (error) {
        logger({
            message: 'Error sign-up Route' + error,
            type: 'error',
        });
        return new Response(
            JSON.stringify({ msg: 'Đăng ký thất bại', success: false, error }),
            {
                status: 500,
            }
        );
    }
}
