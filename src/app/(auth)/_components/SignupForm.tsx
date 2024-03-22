'use client';
import { Button } from '@/components/ui';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

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
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();
    const { data: session } = useSession();

    const { register, handleSubmit, formState } = useForm<FormData>();

    const { errors, isSubmitting } = formState;

    useEffect(() => {
        if (session) {
            router.push('/');
        }
    }, [session, router]);

    const signUp: SubmitHandler<FormData> = async (data) => {
        if (isSubmitting) return;

        if (data.password !== data.repassword) {
            toast.error('Mật khẩu không khớp', {
                id: 'password-not-match',
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
                setIsLoginForm(true);
            } else {
                toast.error(result.msg, {
                    id: 'signup-fail',
                });
            }
        } catch (error) {
            console.log(error);
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
                    {...register('email', {
                        required: true,
                        pattern: {
                            value: /\S+@\S+\.\S+/,
                            message: 'Email không hợp lệ',
                        },
                    })}
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
                    {...register('username', {
                        required: true,
                        minLength: {
                            value: 3,
                            message: 'Tên đăng nhập phải có ít nhất 3 kí tự',
                        },
                        maxLength: {
                            value: 20,
                            message: 'Tên đăng nhập không được quá 20 kí tự',
                        },
                    })}
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
                    {...register('name', {
                        required: true,
                        minLength: {
                            value: 3,
                            message: 'Họ và tên phải có ít nhất 3 kí tự',
                        },
                        maxLength: {
                            value: 50,
                            message: 'Họ và tên không được quá 50 kí tự',
                        },
                    })}
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
                    {...register('password', {
                        required: true,
                        minLength: {
                            value: 6,
                            message: 'Mật khẩu phải có ít nhất 6 kí tự',
                        },
                        maxLength: {
                            value: 50,
                            message: 'Mật khẩu không được quá 50 kí tự',
                        },
                    })}
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
                    {...register('repassword', {
                        required: true,
                        minLength: {
                            value: 6,
                            message: 'Mật khẩu phải có ít nhất 6 kí tự',
                        },
                        maxLength: {
                            value: 50,
                            message: 'Mật khẩu không được quá 50 kí tự',
                        },
                    })}
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
                disabled={isLoading}
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
