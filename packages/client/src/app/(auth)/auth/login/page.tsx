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
import { checkAuth } from '@/lib/actions/user.action';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface FormLoginData {
    email: string;
    password: string;
}

const LoginPage = () => {
    const router = useRouter();
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const form = useForm<FormLoginData>({
        defaultValues: {
            email: '',
            password: '',
        },
    });
    const {
        handleSubmit,
        formState: { isSubmitting, isLoading, errors },
        setError,
        reset,
    } = form;

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
                callbackUrl: '/',
            });

            if (!res?.ok) {
                toast.error('Đã có lỗi xảy ra khi đăng nhập', {
                    id: 'error-login',
                });
                return;
            }

            if (res?.ok) {
                toast.success('Đăng nhập thành công!');
                reset();
                router.push('/');
            }
        } catch (error: any) {
            toast.error('Đã có lỗi xảy ra khi đăng nhập', {
                id: 'error-login',
            });
        }
    };

    return (
        <>
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
                                <span className="text-cyan-600">Đăng nhập</span>
                            </h2>
                            <div className="from-blue-500 mx-auto h-1 w-16 rounded-full bg-gradient-to-r to-cyan-500"></div>
                        </div>

                        <div className="space-y-6">
                            <Form {...form}>
                                <form
                                    method="POST"
                                    onSubmit={handleSubmit(loginWithCrenditals)}
                                    className="space-y-5"
                                >
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="font-medium text-slate-700 dark:text-slate-300">
                                                    Email của bạn
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            placeholder="Nhập email của bạn"
                                                            // className="focus:border-blue-400 focus:ring-blue-400/20 h-12 rounded-xl border-slate-200 bg-white/50 backdrop-blur-sm transition-all duration-300 hover:bg-white/70 dark:border-slate-600 dark:bg-slate-700/50 dark:hover:bg-slate-700/70"
                                                            {...field}
                                                        />
                                                        <div className="from-blue-500/10 pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r to-cyan-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="text-sm text-red-500" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="font-medium text-slate-700 dark:text-slate-300">
                                                    Mật khẩu
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            type="password"
                                                            placeholder="••••••••"
                                                            // className="focus:border-blue-400 focus:ring-blue-400/20 h-12 rounded-xl border-slate-200 bg-white/50 backdrop-blur-sm transition-all duration-300 hover:bg-white/70 dark:border-slate-600 dark:bg-slate-700/50 dark:hover:bg-slate-700/70"
                                                            {...field}
                                                        />
                                                        <div className="from-blue-500/10 pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r to-cyan-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="text-sm text-red-500" />
                                            </FormItem>
                                        )}
                                    />

                                    {errors.root && (
                                        <div className="rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
                                            <FormMessage className="text-sm font-medium text-red-600 dark:text-red-400">
                                                {errors.root.message}
                                            </FormMessage>
                                        </div>
                                    )}

                                    <div className="mt-4 flex justify-end">
                                        <Button
                                            className="p-0"
                                            variant={'text'}
                                            href="/auth/forgot-password"
                                            size={'sm'}
                                        >
                                            Quên mật khẩu?
                                        </Button>
                                    </div>

                                    <Button
                                        variant={'primary'}
                                        type="submit"
                                        className="from-blue-600 hover:from-blue-700 h-12 w-full transform rounded-xl bg-gradient-to-r to-cyan-600 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:to-cyan-700 hover:shadow-xl active:scale-[0.98] disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center justify-center">
                                                <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                                Đang đăng nhập...
                                            </div>
                                        ) : (
                                            'Đăng nhập'
                                        )}
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
                            onClick={loginWithGoogle}
                            disabled={isGoogleLoading || isSubmitting}
                            className="h-12 w-full transform rounded-xl border-2 border-slate-200 bg-white font-semibold text-slate-700 shadow-md transition-all duration-300 hover:scale-[1.02] hover:border-slate-300 hover:shadow-lg active:scale-[0.98] disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:border-slate-500"
                        >
                            <div className="flex items-center justify-center">
                                {isGoogleLoading ? (
                                    <>
                                        <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-slate-400 border-t-transparent"></div>
                                        <span>Đang đăng nhập...</span>
                                    </>
                                ) : (
                                    <>
                                        <Icons.Google className="mr-3 h-5 w-5" />
                                        <span>Đăng nhập với Google</span>
                                    </>
                                )}
                            </div>
                        </Button>

                        {/* Sign up link */}
                        <div className="mt-8 text-center">
                            <span className="text-slate-600 dark:text-slate-400">
                                Chưa có tài khoản?{' '}
                            </span>
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

            {/* {isSubmitting && <Loading overlay fullScreen />} */}
        </>
    );
};

export default LoginPage;
