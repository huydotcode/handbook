'use client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpValidation } from '@/lib/validation';
import toast from 'react-hot-toast';
import logger from '@/utils/logger';
import { Icons } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import React from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';

type FormSignupData = {
    email: string;
    username: string;
    name: string;
    password: string;
    repassword: string;
};

const SignUpPage = () => {
    const form = useForm<FormSignupData>({
        resolver: zodResolver(signUpValidation),
    });

    const { register, handleSubmit, formState, setError } = form;
    const router = useRouter();

    const { errors, isSubmitting } = formState;

    const loginWithGoogle = async () => {
        try {
            await signIn('google');
        } catch (error) {
            toast.error('Đăng nhập thất bại');
        }
    };

    const signUp: SubmitHandler<FormSignupData> = async (data) => {
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
                    id: 'sign-up-success',
                });

                router.push('/auth/login');
            } else {
                toast.error(result.msg, {
                    id: 'sign-up-fail',
                });
            }
        } catch (error) {
            logger({
                message: 'Error sign-up' + error,
                type: 'error',
            });
            toast.error('Có lỗi xảy ra khi đăng ký');
        }
    };

    return (
        <div className="bg-glass relative flex w-[450px] max-w-screen flex-col rounded-xl px-6 py-10 shadow-lg">
            <h2 className="flex justify-center text-center text-2xl font-semibold uppercase tracking-tight">
                Đăng ký
            </h2>

            <div className="mt-4 ">
                <Form {...form}>
                    <form
                        className={'flex w-full flex-col gap-2'}
                        onSubmit={handleSubmit(signUp)}
                    >
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên đăng nhập</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Tên đăng nhập"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Họ và tên</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Họ và tên"
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
                                            placeholder="Mật khẩu"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="repassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nhập lại mật khẩu</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Nhập lại mật khẩu"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            className="mt-4 h-10 w-full"
                            variant={'primary'}
                            type="submit"
                            disabled={isSubmitting}
                        >
                            <h5 className="text-lg">
                                {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
                            </h5>
                        </Button>
                    </form>
                </Form>
            </div>

            <div className={'my-6 h-[1px] w-full bg-secondary-2'}></div>

            <Button className="w-full" size={'lg'} onClick={loginWithGoogle}>
                <Icons.Google className="mr-2" />
                <h5 className="text-base">Đăng nhập với Google</h5>
            </Button>

            <div className="flex items-center justify-center">
                <h5 className={'text-sm text-secondary-1'}>Đã có tài khoản?</h5>
                <Button
                    href={'/auth/login'}
                    className="text-sm font-bold text-primary-2"
                    variant={'text'}
                    size={'md'}
                >
                    Đăng nhập ngay
                </Button>
            </div>
        </div>
    );
};

export default SignUpPage;
