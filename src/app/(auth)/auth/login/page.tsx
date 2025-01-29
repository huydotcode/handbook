'use client';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { checkAuth } from '@/lib/actions/user.action';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Icons } from '@/components/ui';
import React from 'react';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginValidation } from '@/lib/validation';
import { Button } from '@/components/ui/Button';

interface FormLoginData {
    email: string;
    password: string;
}

const LoginPage = () => {
    const router = useRouter();
    const form = useForm<FormLoginData>({
        defaultValues: {
            email: '',
            password: '',
        },
        resolver: zodResolver(loginValidation),
    });
    const {
        handleSubmit,
        formState: { isSubmitting, isLoading, errors },
        setError,
        reset,
    } = form;

    const loginWithGoogle = async () => {
        try {
            await signIn('google');
        } catch (error) {
            toast.error('Đăng nhập thất bại');
        }
    };

    const loginWithCrenditals: SubmitHandler<FormLoginData> = async (
        formData
    ) => {
        const { email, password } = formData;

        try {
            const validUser = (await checkAuth({
                email,
                password,
            })) as {
                error: {
                    type: string;
                    message: string;
                };
            } | null;

            console.log({
                validUser,
            });

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
            }

            const res = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (!res?.ok) {
                toast.error('Đã có lỗi xảy ra khi đăng nhập', {
                    id: 'error-login',
                });
            }

            reset();
            router.push('/');
        } catch (error: any) {
            toast.error('Đã có lỗi xảy ra khi đăng nhập', {
                id: 'error-login',
            });
        }
    };

    return (
        <div className="bg-glass relative w-[400px] max-w-screen rounded-xl px-4 py-10 shadow-lg">
            <h2 className="flex justify-center text-center text-2xl font-semibold uppercase tracking-tight">
                Đăng nhập
            </h2>

            <div className="mt-4">
                <Form {...form}>
                    <form onSubmit={handleSubmit(loginWithCrenditals)}>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email của bạn</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Email của bạn"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mật khẩu</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Mật khẩu của bạn"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormMessage className="h-4">
                            {errors.root && errors.root.message}
                        </FormMessage>

                        <Button
                            variant={'primary'}
                            type="submit"
                            className="mt-4 w-full"
                            disabled={isSubmitting}
                        >
                            Đăng nhập
                        </Button>
                    </form>
                </Form>
            </div>

            <div className={'my-6 h-[1px] w-full bg-secondary-2'}></div>

            <Button
                className="w-full"
                variant={'secondary'}
                size={'lg'}
                onClick={loginWithGoogle}
                disabled={isLoading}
            >
                <Icons.Google className="mr-2" />
                <h5 className="text-base">Đăng nhập với Google</h5>
            </Button>

            <div className="flex items-center justify-center">
                <h5 className={'text-sm text-secondary-1'}>
                    Chưa có tài khoản?
                </h5>
                <Button
                    href={'/auth/sign-up'}
                    className="text-sm font-bold text-primary-2"
                    variant={'text'}
                    size={'md'}
                >
                    Đăng ký ngay
                </Button>
            </div>
        </div>
    );
};

export default LoginPage;
