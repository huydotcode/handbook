'use client';
import { Button, Icons, Loading } from '@/components/ui';
import { UserService } from '@/lib/services';
import logger from '@/utils/logger';
import { Dialog } from '@mui/material';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface Props {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
interface IFormData {
    email: string;
    password: string;
}

const LoginForm: React.FC<Props> = ({ setIsLoading }) => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting, isLoading },
        setError,
        reset,
    } = useForm<IFormData>();

    const loginWithCrenditals: SubmitHandler<IFormData> = async (formData) => {
        setIsLoading(true);
        const { email, password } = formData;

        try {
            const validUser = (await UserService.checkAuth({
                email,
                password,
            })) as {
                error: {
                    type: string;
                    message: string;
                };
            } | null;

            if (validUser?.error) {
                const type = validUser.error.type;

                if (type == 'email') {
                    setError('root', {
                        message: 'Người dùng không tồn tại',
                    });
                }

                if (type == 'password') {
                    setError('root', {
                        message: validUser.error.message,
                    });
                }

                return;
            } else {
                const res = await signIn('credentials', {
                    email,
                    password,
                    redirect: false,
                });

                if (res?.ok) {
                    reset();
                    router.push('/');
                }
            }
        } catch (error: any) {
            toast.error('Đã có lỗi xảy ra khi đăng nhập', {
                id: 'error-login',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(loginWithCrenditals)}>
                <div className="flex flex-col space-y-1">
                    <label htmlFor="username">Email</label>
                    <input
                        className="focus:ring-blue-600 rounded-md border p-2 shadow-md focus:outline-none focus:ring-2"
                        type="text"
                        id="username"
                        placeholder="Nhập email của bạn"
                        {...register('email', {
                            required: 'Hãy nhập email',
                        })}
                    />
                    {errors.email && (
                        <p className="text-red-500">{errors.email.message}</p>
                    )}
                </div>

                <div className="flex flex-col space-y-1">
                    <label htmlFor="password" className="mt-2">
                        Mật khẩu
                    </label>
                    <input
                        className="focus:ring-blue-600 rounded-md border p-2 shadow-md focus:outline-none focus:ring-2"
                        type="password"
                        id="password"
                        placeholder="Nhập mật khẩu"
                        {...register('password', {
                            required: 'Hãy nhập mật khẩu',
                        })}
                    />
                    {errors.password && (
                        <p className="text-red-500">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                {errors.root && (
                    <p className="text-red-500">{errors.root.message}</p>
                )}

                <Button
                    className="mt-6 h-10 w-full"
                    type="submit"
                    variant={'primary'}
                    size={'default'}
                    disabled={isSubmitting || isLoading}
                >
                    {isSubmitting ? (
                        <Icons.Loading className="animate-spin" />
                    ) : (
                        <h5 className="text-lg">Đăng nhập</h5>
                    )}
                </Button>
            </form>
        </>
    );
};
export default LoginForm;
