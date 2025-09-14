'use client';
import { Icons } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { API_ROUTES } from '@/config/api';
import { signUpValidation } from '@/lib/validation';
import logger from '@/utils/logger';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

type FormSignupData = {
    email: string;
    username: string;
    name: string;
    password: string;
    repassword: string;
};

const SignUpPage = () => {
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const form = useForm<FormSignupData>({
        resolver: zodResolver(signUpValidation),
        defaultValues: {
            email: '',
            username: '',
            name: '',
            password: '',
            repassword: '',
        },
    });

    const { register, handleSubmit, formState, setError } = form;
    const router = useRouter();

    const { errors, isSubmitting } = formState;

    const loginWithGoogle = async () => {
        try {
            setIsGoogleLoading(true);
            const result = await signIn('google', {
                callbackUrl: '/',
                redirect: false,
            });

            if (result?.ok) {
                toast.success('Đăng nhập thành công!');
                router.push('/');
            } else {
                toast.error('Đăng nhập thất bại');
            }
        } catch (error) {
            toast.error('Đăng nhập thất bại');
        } finally {
            setIsGoogleLoading(false);
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
            const res = await fetch(API_ROUTES.AUTH.SIGN_UP, {
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
        <div className="relative mx-auto w-full max-w-md">
            {/* Glassmorphism container with modern design */}
            <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/80 shadow-2xl backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-800/80">
                {/* Gradient overlay */}
                <div className="from-blue-50/50 dark:from-blue-900/20 absolute inset-0 bg-gradient-to-br via-cyan-50/30 to-teal-50/50 dark:via-cyan-900/10 dark:to-teal-900/20"></div>

                {/* Animated background elements */}
                <div className="from-blue-400/20 absolute right-0 top-0 h-32 w-32 -translate-y-16 translate-x-16 rounded-full bg-gradient-to-br to-cyan-400/20 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 h-32 w-32 -translate-x-16 translate-y-16 rounded-full bg-gradient-to-br from-teal-400/20 to-emerald-400/20 blur-2xl"></div>

                <div className="relative z-10 px-8 py-10">
                    {/* Header with gradient text */}
                    <div className="mb-8 text-center">
                        <h2 className="mb-2 text-3xl font-bold">
                            <span className="text-cyan-600">Đăng ký</span>
                        </h2>
                        <div className="from-blue-500 mx-auto h-1 w-16 rounded-full bg-gradient-to-r to-cyan-500"></div>
                    </div>

                    <div className="space-y-6">
                        <Form {...form}>
                            <form
                                className={'flex w-full flex-col gap-2'}
                                onSubmit={handleSubmit(signUp)}
                                method="POST"
                            >
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Email"
                                                    {...field}
                                                />
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
                                            <FormLabel>
                                                Nhập lại mật khẩu
                                            </FormLabel>
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
                                        {isSubmitting
                                            ? 'Đang đăng ký...'
                                            : 'Đăng ký'}
                                    </h5>
                                </Button>
                            </form>
                        </Form>
                    </div>

                    {/* Divider with gradient */}
                    <div className="my-8 flex items-center">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-600"></div>
                        <span className="px-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                            hoặc
                        </span>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-600"></div>
                    </div>

                    {/* Google login button */}
                    <Button
                        className="w-full"
                        size={'lg'}
                        onClick={loginWithGoogle}
                        disabled={isGoogleLoading || isSubmitting}
                    >
                        {isGoogleLoading ? (
                            <>
                                <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-slate-400 border-t-transparent"></div>
                                <h5 className="text-base">Đang đăng nhập...</h5>
                            </>
                        ) : (
                            <>
                                <Icons.Google className="mr-2" />
                                <h5 className="text-base">
                                    Đăng nhập với Google
                                </h5>
                            </>
                        )}
                    </Button>

                    {/* Sign up link */}
                    <div className="flex items-center justify-center">
                        <h5 className={'text-sm text-secondary-1'}>
                            Đã có tài khoản?
                        </h5>
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

                {/* Animated border */}
                <div className="border-gradient-to-r from-blue-400/30 pointer-events-none absolute inset-0 rounded-3xl border via-cyan-400/30 to-teal-400/30 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
            </div>

            {/* Floating decoration elements */}
            <div className="from-blue-400 absolute -right-2 -top-2 h-4 w-4 animate-pulse rounded-full bg-gradient-to-r to-cyan-400 opacity-60"></div>
            <div
                className="absolute -bottom-2 -left-2 h-3 w-3 animate-pulse rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 opacity-60"
                style={{ animationDelay: '0.5s' }}
            ></div>
        </div>
    );
};

export default SignUpPage;
