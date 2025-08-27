'use client';
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
import axiosInstance from '@/lib/axios';
import {
    ResetPasswordValidation,
    resetPasswordValidation,
} from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface FormForgotPasswordData {
    email: string;
    otp: string;
    password: string;
    repassword: string;
}

type Step = 'send-otp' | 'verify-otp' | 'reset-password';

const ForgotPassword = () => {
    const router = useRouter();
    const form = useForm<FormForgotPasswordData>({
        defaultValues: {
            email: '',
            password: '',
            repassword: '',
            otp: '',
        },
        resolver: zodResolver(resetPasswordValidation),
    });
    const {
        handleSubmit,
        formState: { isSubmitting, isLoading, errors },
        setError,
        reset,
    } = form;

    const [step, setStep] = useState<Step>('send-otp');
    const [isSendingOtp, setIsSendingOtp] = useState<boolean>(false);
    const [isVerified, setIsVerified] = useState<boolean>(false);

    const handleSendOtp = async (email: string) => {
        setIsSendingOtp(true);
        try {
            await axiosInstance.post(API_ROUTES.AUTH.SEND_OTP, {
                email,
            });

            setIsSendingOtp(false);
            setStep('verify-otp');
            toast.success('OTP đã được gửi tới email của bạn', {
                id: 'success-send-otp',
            });
        } catch (error) {
            setIsSendingOtp(false);
            toast.error('Đã có lỗi xảy ra khi gửi OTP', {
                id: 'error-send-otp',
            });
            return;
        }
    };

    const handleVerifyOtp = async (otp: string) => {
        try {
            const email = form.getValues('email');

            const response = await axiosInstance.post(
                API_ROUTES.AUTH.VERIFY_OTP,
                {
                    email,
                    otp,
                }
            );

            if (response?.data?.success) {
                setIsVerified(true);
                setStep('reset-password');
                toast.success('Xác thực OTP thành công', {
                    id: 'success-verify-otp',
                });
            } else {
                setError('root', {
                    message: 'Xác thực OTP không thành công',
                });
            }
        } catch (error) {
            setError('root', {
                message: 'Đã có lỗi xảy ra khi xác thực OTP',
            });
        }
    };

    const handleResetPassword = async (formData: FormForgotPasswordData) => {
        const { email, password, repassword } = formData;

        if (password !== repassword) {
            setError('root', {
                message: 'Mật khẩu và xác nhận mật khẩu không khớp',
            });
            return;
        }

        try {
            await axiosInstance.post(API_ROUTES.AUTH.RESET_PASSWORD, {
                email,
                newPassword: password,
            });
            reset();
            setStep('send-otp');
            toast.success('Đặt lại mật khẩu thành công', {
                id: 'success-reset-password',
            });

            router.push('/auth/login');
        } catch (error) {
            toast.error('Đã có lỗi xảy ra khi đặt lại mật khẩu', {
                id: 'error-reset-password',
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
                                <span className="text-cyan-600">
                                    Đặt lại mật khẩu
                                </span>
                            </h2>
                            <div className="from-blue-500 mx-auto h-1 w-16 rounded-full bg-gradient-to-r to-cyan-500"></div>
                        </div>

                        <div className="space-y-6">
                            <Form {...form}>
                                <form
                                    className="space-y-5"
                                    onSubmit={handleSubmit(handleResetPassword)}
                                >
                                    {step === 'send-otp' && (
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem className="space-y-2">
                                                    <FormLabel className="font-medium text-slate-700 dark:text-slate-300">
                                                        Email của bạn
                                                    </FormLabel>
                                                    <FormControl>
                                                        <div className="relative flex items-center">
                                                            <Input
                                                                placeholder="Nhập email của bạn"
                                                                {...field}
                                                            />
                                                            <div className="from-blue-500/10 pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r to-cyan-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                                                            <Button
                                                                className="rounded-l-none"
                                                                onClick={() =>
                                                                    handleSendOtp(
                                                                        field.value
                                                                    )
                                                                }
                                                                size={'sm'}
                                                                variant={
                                                                    'primary'
                                                                }
                                                                disabled={
                                                                    isSendingOtp
                                                                }
                                                            >
                                                                {isSendingOtp
                                                                    ? 'Đang gửi...'
                                                                    : 'Gửi OTP'}
                                                            </Button>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage className="text-sm text-red-500" />
                                                </FormItem>
                                            )}
                                        />
                                    )}

                                    {/* Nhập OTP */}
                                    {step === 'verify-otp' && (
                                        <FormField
                                            control={form.control}
                                            name="otp"
                                            render={({ field }) => (
                                                <FormItem className="space-y-2">
                                                    <FormLabel className="font-medium text-slate-700 dark:text-slate-300">
                                                        Nhập OTP đã gửi cho
                                                        email{' '}
                                                        {form.getValues(
                                                            'email'
                                                        )}
                                                    </FormLabel>
                                                    <FormControl>
                                                        <div className="relative flex items-center">
                                                            <Input
                                                                placeholder="Nhập OTP"
                                                                {...field}
                                                            />

                                                            <Button
                                                                className="rounded-l-none"
                                                                size={'sm'}
                                                                variant={
                                                                    'primary'
                                                                }
                                                                onClick={() =>
                                                                    handleVerifyOtp(
                                                                        field.value
                                                                    )
                                                                }
                                                                disabled={
                                                                    isSendingOtp ||
                                                                    isVerified
                                                                }
                                                            >
                                                                {isSendingOtp
                                                                    ? 'Đang xác thực...'
                                                                    : isVerified
                                                                      ? 'Đã xác thực'
                                                                      : 'Xác thực OTP'}
                                                            </Button>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage className="text-sm text-red-500" />
                                                </FormItem>
                                            )}
                                        />
                                    )}

                                    {step === 'reset-password' && (
                                        <>
                                            <FormField
                                                control={form.control}
                                                name="password"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-2">
                                                        <FormLabel className="font-medium text-slate-700 dark:text-slate-300">
                                                            Mật khẩu mới
                                                        </FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Input
                                                                    type="password"
                                                                    placeholder="••••••••"
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
                                                name="repassword"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-2">
                                                        <FormLabel className="font-medium text-slate-700 dark:text-slate-300">
                                                            Xác nhận mật khẩu
                                                        </FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Input
                                                                    type="password"
                                                                    placeholder="••••••••"
                                                                    {...field}
                                                                />
                                                                <div className="from-blue-500/10 pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r to-cyan-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage className="text-sm text-red-500" />
                                                    </FormItem>
                                                )}
                                            />
                                        </>
                                    )}

                                    {errors.root && (
                                        <div className="rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
                                            <FormMessage className="text-sm font-medium text-red-600 dark:text-red-400">
                                                {errors.root.message}
                                            </FormMessage>
                                        </div>
                                    )}

                                    <Button
                                        className="from-blue-600 hover:from-blue-700 h-10 w-full transform rounded-xl bg-gradient-to-r to-cyan-600 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:to-cyan-700 hover:shadow-xl active:scale-[0.98] disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
                                        type="submit"
                                        variant={'primary'}
                                        size={'md'}
                                        disabled={
                                            isSubmitting ||
                                            step !== 'reset-password'
                                        }
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center justify-center">
                                                <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                                <span>Đang xử lý...</span>
                                            </div>
                                        ) : (
                                            'Đổi mật khẩu'
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

                        <div className="mt-8 text-center">
                            <Button
                                href={'/auth/login'}
                                className="text-sm font-bold text-primary-2"
                                variant={'text'}
                                size={'md'}
                            >
                                Quay lại đăng nhập
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
        </>
    );
};

export default ForgotPassword;
