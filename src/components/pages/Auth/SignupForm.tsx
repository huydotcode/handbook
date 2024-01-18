'use client';
import { Button } from '@/components';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
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

const SignupForm: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();
    const { data: session } = useSession();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormData>();

    useEffect(() => {
        if (session) {
            router.push('/');
        }
    }, [session, router]);

    const loginWithGoogle = async () => {
        if (isSubmitting) return;

        try {
            setIsLoading(true);
            await signIn('google');
        } catch (error) {
            toast.error('Đăng nhập thất bại');
        } finally {
            setIsLoading(false);
        }
    };

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
                router.push('/login');
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
        <div className="w-full flex flex-col items-center max-w-md space-y-8 px-10 py-10 rounded-xl shadow-lg bg-glass">
            <h2 className="mt-6 text-center text-2xl tracking-tight">
                Đăng ký với Handbook
            </h2>

            <div className="flex flex-col w-full">
                <form onSubmit={handleSubmit(signUp)}>
                    {/* Email */}
                    <div className="flex flex-col mt-2">
                        <label htmlFor="username">Email của bạn</label>
                        <input
                            className="p-2  bg-transparent shadow-md rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                            type="text"
                            id="email"
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
                            <span className="text-red-500 text-sm mt-1">
                                {errors.email.message}
                            </span>
                        )}
                    </div>

                    {/* User name */}
                    <div className="flex flex-col mt-2">
                        <label htmlFor="username">Tên đăng nhập</label>
                        <input
                            className="p-2  bg-transparent shadow-md rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                            type="text"
                            id="username"
                            placeholder="Tên đăng nhập của bạn"
                            {...register('username', {
                                required: true,
                                minLength: {
                                    value: 3,
                                    message:
                                        'Tên đăng nhập phải có ít nhất 3 kí tự',
                                },
                                maxLength: {
                                    value: 20,
                                    message:
                                        'Tên đăng nhập không được quá 20 kí tự',
                                },
                            })}
                        />
                        {errors.username && (
                            <span className="text-red-500 text-sm mt-1">
                                {errors.username.message}
                            </span>
                        )}
                    </div>

                    {/* Full name */}
                    <div className="flex flex-col mt-2">
                        <label htmlFor="name">Họ và tên của bạn</label>
                        <input
                            className="p-2  bg-transparent shadow-md rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                            type="text"
                            id="name"
                            placeholder="Họ và tên của bạn"
                            {...register('name', {
                                required: true,
                                minLength: {
                                    value: 3,
                                    message:
                                        'Họ và tên phải có ít nhất 3 kí tự',
                                },
                                maxLength: {
                                    value: 50,
                                    message:
                                        'Họ và tên không được quá 50 kí tự',
                                },
                            })}
                        />
                        {errors.name && (
                            <span className="text-red-500 text-sm mt-1">
                                {errors.name.message}
                            </span>
                        )}
                    </div>

                    {/* Password */}
                    <div className="flex flex-col mt-2">
                        <label htmlFor="password" className=" mt-2">
                            Mật khẩu
                        </label>
                        <input
                            className="p-2  bg-transparent shadow-md rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                            type="password"
                            id="password"
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
                            <span className="text-red-500 text-sm mt-1">
                                {errors.password.message}
                            </span>
                        )}
                    </div>

                    {/* Re-password */}
                    <div className="flex flex-col mt-2">
                        <label htmlFor="repassword" className=" mt-2">
                            Nhập lại mật khẩu
                        </label>
                        <input
                            className="p-2 bg-transparent shadow-md rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                            type="password"
                            id="repassword"
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
                            <span className="text-red-500 text-sm mt-1">
                                {errors.repassword.message}
                            </span>
                        )}
                    </div>

                    <Button
                        className="mt-6 w-full bg-primary text-white"
                        variant={'event'}
                        disabled={isLoading}
                        type="submit"
                    >
                        <h5 className="text-lg">
                            {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
                        </h5>
                    </Button>
                </form>

                <div className="flex justify-center items-center mt-4">
                    <h5>Bạn đã có tài khoản?</h5>
                    <Link
                        className="ml-2 text-blue-600 hover:underline"
                        href="/login"
                    >
                        Đăng nhập ngay
                    </Link>
                </div>
            </div>

            <Button
                className="w-full"
                variant={'event'}
                size={'large'}
                onClick={loginWithGoogle}
                disabled={isLoading}
            >
                <svg
                    className="w-6 mr-2"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fab"
                    data-icon="github"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                >
                    <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                    />
                    <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                    />
                    <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                    />
                    <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                    />
                    <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                <h5 className="text-base">Đăng nhập với Google</h5>
            </Button>
        </div>
    );
};
export default SignupForm;
