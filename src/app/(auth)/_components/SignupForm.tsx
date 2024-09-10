'use client';
import { Button } from '@/components/ui';
import logger from '@/utils/logger';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpValidation } from '@/lib/validation';

type FormData = {
    email: string;
    username: string;
    name: string;
    password: string;
    repassword: string;
};

interface Props {
    setIsLoginForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignupForm: React.FC<Props> = ({ setIsLoginForm }) => {
    const { register, handleSubmit, formState, setError } = useForm<FormData>({
        resolver: zodResolver(signUpValidation),
    });

    const { errors, isSubmitting } = formState;

    const signUp: SubmitHandler<FormData> = async (data) => {
        if (isSubmitting) return;

        if (data.password !== data.repassword) {
            setError('repassword', {
                type: 'manual',
                message: 'Mật khẩu không khớp',
            });

            return;
        }

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await res.json();
            if (result.success) {
                toast.success('Đăng ký thành công', {
                    id: 'signup-success',
                });

                // Sleep 1000ms to show success toast
                setTimeout(() => {
                    setIsLoginForm(true);
                }, 1000);
            } else {
                toast.error(result.msg, {
                    id: 'signup-fail',
                });
            }
        } catch (error) {
            logger({
                message: 'Error signup' + error,
                type: 'error',
            });
            toast.error('Có lỗi xảy ra khi đăng ký');
        }
    };

    return (
        <form onSubmit={handleSubmit(signUp)}>
            {/* Email */}
            <div className="mt-2 flex flex-col">
                <label htmlFor="username">Email của bạn</label>
                <input
                    className="focus:ring-blue-600  rounded-md border p-2  shadow-md focus:outline-none focus:ring-2"
                    type="text"
                    id="email"
                    autoComplete="off"
                    placeholder="Email của bạn"
                    {...register('email')}
                />
                {errors.email && (
                    <span className="mt-1 text-sm text-red-500">
                        {errors.email.message}
                    </span>
                )}
            </div>

            {/* User name */}
            <div className="mt-2 flex flex-col">
                <label htmlFor="username">Tên đăng nhập</label>
                <input
                    className="focus:ring-blue-600  rounded-md  border p-2  shadow-md focus:outline-none focus:ring-2"
                    type="text"
                    id="username"
                    autoComplete="off"
                    placeholder="Tên đăng nhập của bạn"
                    {...register('username')}
                />
                {errors.username && (
                    <span className="mt-1 text-sm text-red-500">
                        {errors.username.message}
                    </span>
                )}
            </div>

            {/* Full name */}
            <div className="mt-2 flex flex-col">
                <label htmlFor="name">Họ và tên của bạn</label>
                <input
                    className="focus:ring-blue-600  rounded-md  border p-2  shadow-md focus:outline-none focus:ring-2"
                    type="text"
                    id="name"
                    autoComplete="off"
                    placeholder="Họ và tên của bạn"
                    {...register('name')}
                />
                {errors.name && (
                    <span className="mt-1 text-sm text-red-500">
                        {errors.name.message}
                    </span>
                )}
            </div>

            {/* Password */}
            <div className="mt-2 flex flex-col">
                <label htmlFor="password" className=" mt-2">
                    Mật khẩu
                </label>
                <input
                    className="focus:ring-blue-600  rounded-md  border p-2  shadow-md focus:outline-none focus:ring-2"
                    type="password"
                    id="password"
                    autoComplete="off"
                    placeholder="Nhập mật khẩu"
                    {...register('password')}
                />
                {errors.password && (
                    <span className="mt-1 text-sm text-red-500">
                        {errors.password.message}
                    </span>
                )}
            </div>

            {/* Re-password */}
            <div className="mt-2 flex flex-col">
                <label htmlFor="repassword" className=" mt-2">
                    Nhập lại mật khẩu
                </label>
                <input
                    className="focus:ring-blue-600 rounded-md  border p-2  shadow-md focus:outline-none focus:ring-2"
                    type="password"
                    id="repassword"
                    autoComplete="off"
                    placeholder="Nhập lại mật khẩu"
                    {...register('repassword')}
                />
                {errors.repassword && (
                    <span className="mt-1 text-sm text-red-500">
                        {errors.repassword.message}
                    </span>
                )}
            </div>

            <Button
                className="mt-6 h-10 w-full"
                variant={'primary'}
                type="submit"
            >
                <h5 className="text-lg">
                    {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
                </h5>
            </Button>
        </form>
    );
};
export default SignupForm;
