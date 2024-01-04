import { Profile, User } from '@/models';
import connectToDB from '@/services/mongoose';
import bcrypt from 'bcrypt';

const saltRounds = 10;

export const POST = async (req: Request, res: Response) => {
    const request = await req.json();

    const { email, name, password, repassword, username } = request;

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

        return new Response(
            JSON.stringify({ msg: 'Đăng ký thành công', success: true }),
            {
                status: 200,
            }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ msg: 'Đăng ký thất bại', success: false, error }),
            {
                status: 500,
            }
        );
    }
};
