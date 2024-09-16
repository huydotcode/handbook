import { z } from 'zod';

export const signUpValidation = z.object({
    email: z.string().email('Email không hợp lệ'),
    username: z
        .string()
        .min(6, 'Username là chuỗi từ 6-50 kí tự')
        .max(50, 'Username là chuỗi từ 6-50 kí tự')
        .regex(
            /^[a-zA-Z0-9_-]+$/,
            'Username chỉ chứa kí tự, số, dấu gạch dưới và gạch ngang'
        ),
    name: z
        .string()
        .min(6, 'Tên là chuỗi từ 6-50 kí tự')
        .max(50, 'Tên là chuỗi từ 6-50 kí tự'),
    password: z
        .string()
        .min(6, 'Mật khẩu từ 6-50 kí tự')
        .max(50, 'Mật khẩu từ 6-50 kí tự'),
    repassword: z
        .string()
        .min(6, 'Mật khẩu từ 6-50 kí tự')
        .max(50, 'Mật khẩu từ 6-50 kí tự'),
});

export type SignUpValidation = z.infer<typeof signUpValidation>;

export const loginValidation = z.object({
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu từ 6-50 kí tự'),
});

export type LoginValidation = z.infer<typeof loginValidation>;

export const createPostValidation = z.object({
    content: z.string().min(1, 'Nội dung không được để trống'),
});

export type CreatePostValidation = z.infer<typeof createPostValidation>;

export const editPostValidation = z.object({
    content: z.string().min(1, 'Nội dung không được để trống'),
});

export type EditPostValidation = z.infer<typeof editPostValidation>;
