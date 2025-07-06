import {
    ALLOWED_TYPE_IMAGES,
    ALLOWED_TYPE_VIDEOS,
} from '@/constants/allowTypeMedia';
import { z } from 'zod';

export const fileSchema = z
    .custom<File>((val) => val instanceof File, {
        message: 'Vui lòng chọn một tệp hợp lệ',
    })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
        message: 'Tệp không được lớn hơn 5MB',
    })
    .refine((file) => ALLOWED_TYPE_IMAGES.includes(file.type), {
        message: 'Chỉ cho phép ảnh định dạng JPG, PNG hoặc WEBP',
    });

export const videoSchema = z
    .custom<File>((val) => val instanceof File, {
        message: 'Vui lòng chọn một tệp video hợp lệ',
    })
    .refine((file) => file.size <= 50 * 1024 * 1024, {
        message: 'Video không được lớn hơn 50MB',
    })
    .refine((file) => ALLOWED_TYPE_VIDEOS.includes(file.type), {
        message: 'Chỉ cho phép video định dạng MP4, WEBM hoặc MOV',
    });

// Sign up validation
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

// Login validation
export const loginValidation = z.object({
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu từ 6-50 kí tự'),
});

export type LoginValidation = z.infer<typeof loginValidation>;

export const resetPasswordValidation = z
    .object({
        email: z.string().email('Email không hợp lệ'),
        password: z.string().min(6, 'Mật khẩu từ 6-50 kí tự'),
        repassword: z.string().min(6, 'Mật khẩu từ 6-50 kí tự'),
        otp: z.string().min(6, 'OTP phải có 6 chữ số'),
    })
    .refine((data) => data.password === data.repassword, {
        message: 'Mật khẩu và xác nhận mật khẩu không khớp',
        path: ['repassword'],
    });

export type ResetPasswordValidation = z.infer<typeof resetPasswordValidation>;

// Create post validation
export const createPostValidation = z.object({
    content: z.string().min(1, 'Nội dung không được để trống'),
    option: z.string().optional(),
    files: z.array(z.any()).optional(),
    tags: z.array(z.string().min(1, 'Tag không được để trống')).optional(),
});

export type CreatePostValidation = z.infer<typeof createPostValidation>;

// Edit post validation
export const editPostValidation = z.object({
    content: z.string().min(1, 'Nội dung không được để trống'),
    option: z.string().optional(),
    files: z.array(z.any()).optional(),
    tags: z.array(z.string().min(1, 'Tag không được để trống')).optional(),
});

export type EditPostValidation = z.infer<typeof editPostValidation>;

// Create group validation
export const createGroupValidation = z.object({
    name: z.string().min(1, 'Tên nhóm không được để trống'),
    description: z.string().min(1, 'Mô tả không được để trống'),
    type: z.string().optional(),
    file: fileSchema.optional(),
});

export type CreateGroupValidation = z.infer<typeof createGroupValidation>;

export const createItemValidation = z.object({
    name: z.string().min(1, 'Tên không được để trống'),
    price: z.string().regex(/^\d+$/, 'Giá tiền không hợp lệ'),
    description: z.string().min(1, 'Mô tả không được để trống'),
    category: z.string().min(1, 'Danh mục không được để trống'),
    location: z.string().min(1, 'Địa điểm không được để trống'),
    images: z.array(z.any()).nonempty(),
});

export type CreateItemValidation = z.infer<typeof createItemValidation>;
