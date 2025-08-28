import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import { MailType } from '../enums/MailType';
import User from '../models/user.model';
import { sendOtpEmail } from '../services/mail.service';
import redis from '../services/redis';

class AuthController {
    public async sendOTP(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { email } = req.body;

            // Kiểm tra xem email có được cung cấp không
            if (!email) {
                res.status(400).json({ error: 'Vui lòng cung cấp email' });
                return;
            }

            // Kiểm tra xem email có tồn tại trong hệ thống không
            const user = await User.findOne({
                email: email,
            });

            if (!user) {
                res.status(404).json({
                    error: 'Email không tồn tại trong hệ thống',
                });
                return;
            }

            const otp = crypto
                .getRandomValues(new Uint32Array(1))[0]
                .toString()
                .padStart(6, '0');

            // OTP expires in 5 minutes
            await redis.set(
                `otp:${email}`,
                JSON.stringify({ otp, expires: Date.now() + 5 * 60 * 1000 }),
                'EX',
                5 * 60
            );

            await sendOtpEmail(email, otp, MailType.FORGOT_PASSWORD);
            res.json({ message: 'OTP đã được gửi tới email của bạn' });
        } catch (err: any) {
            console.error(err);
            res.status(500).json({
                error: 'Không thể gửi email' + err.message,
            });
        }
    }

    public async verifyOTP(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { email, otp } = req.body;

            const otpData = await redis.get(`otp:${email}`);
            if (!otpData) {
                res.status(400).json({
                    error: 'OTP không hợp lệ hoặc đã hết hạn',
                });
                return;
            }

            const { otp: storedOtp, expires } = JSON.parse(otpData);
            if (Date.now() > expires) {
                res.status(400).json({ error: 'OTP đã hết hạn' });
                return;
            }

            if (storedOtp !== otp) {
                res.status(400).json({ error: 'OTP không chính xác' });
                return;
            }

            // Xóa OTP sau khi xác thực thành công
            await redis.del(`otp:${email}`);

            res.json({
                success: true,
                message: 'Xác thực OTP thành công',
            });
        } catch (err: any) {
            console.error(err);
            res.status(500).json({
                error: 'Đã xảy ra lỗi khi xác thực OTP: ' + err.message,
            });
        }
    }

    public async resetPassword(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { email, newPassword } = req.body;

            // Kiểm tra xem email và OTP có được cung cấp không
            if (!email || !newPassword) {
                res.status(400).json({
                    error: 'Vui lòng cung cấp email, và mật khẩu mới',
                });
                return;
            }

            // Kiểm tra xem email có tồn tại trong hệ thống không
            const user = await User.findOne({
                email: email,
            });

            if (!user) {
                res.status(404).json({
                    error: 'Email không tồn tại trong hệ thống',
                });
                return;
            }

            // Cập nhật mật khẩu mới
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            await user.save();

            res.json({
                success: true,
                message: 'Mật khẩu đã được cập nhật thành công',
            });
        } catch (err: any) {
            console.error(err);
            res.status(500).json({
                error: 'Đã xảy ra lỗi khi đặt lại mật khẩu: ' + err.message,
            });
        }
    }
}

export default new AuthController();
