import { createTransporter } from '../utils/mailer';
import { getOtpEmailHtml } from '../emails/templates';
import { MailType } from '../enums/MailType';

export async function sendOtpEmail(
    to: string,
    otp: string,
    type: MailType
): Promise<void> {
    const transporter = await createTransporter();

    const subject =
        type === MailType.REGISTER
            ? '[HANDBOOK] - OTP Đăng ký tài khoản'
            : '[HANDBOOK] - OTP Đặt lại mật khẩu';

    const html = getOtpEmailHtml(otp, type);

    const mailOptions = {
        from: `"Handbook" <${process.env.GMAIL_USER}>`,
        to,
        subject,
        html,
    };

    await transporter.sendMail(mailOptions);
}
