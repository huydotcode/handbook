import { z } from 'zod';

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

// Create post validation
export const createPostValidation = z.object({
    content: z.string().min(1, 'Nội dung không được để trống'),
    option: z.string().optional(),
});

export type CreatePostValidation = z.infer<typeof createPostValidation>;

// Edit post validation
export const editPostValidation = z.object({
    content: z.string().min(1, 'Nội dung không được để trống'),
    option: z.string().optional(),
});

export type EditPostValidation = z.infer<typeof editPostValidation>;

// Create group validation
export const createGroupValidation = z.object({
    name: z.string().min(1, 'Tên nhóm không được để trống'),
    description: z.string().min(1, 'Mô tả không được để trống'),
    type: z.string().optional(),
});

export type CreateGroupValidation = z.infer<typeof createGroupValidation>;

export const createItemValidation = z.object({
    name: z.string().min(1, 'Tên không được để trống'),
    price: z.number().min(0, 'Giá không được âm'),
    description: z.string().min(1, 'Mô tả không được để trống'),
    category: z.string().min(1, 'Danh mục không được để trống'),
    location: z.string().min(1, 'Địa điểm không được để trống'),
});

export type CreateItemValidation = z.infer<typeof createItemValidation>;
