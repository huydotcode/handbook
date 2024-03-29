'use client';
import { Button, Icons } from '@/components/ui';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface Props {}
interface IFormData {
    email: string;
    password: string;
}

const LoginForm: React.FC<Props> = ({}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const { data: session } = useSession();

    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm<IFormData>();
    const error = searchParams?.get('error') || '';

    useEffect(() => {
        if (session) {
            router.push('/');
        }
    }, [session, router]);

    useEffect(() => {
        if (error.length > 0) {
            toast.error(error);
        }
    }, [searchParams, error]);

    const loginWithCrenditals: SubmitHandler<IFormData> = async (formData) => {
        const { email, password } = formData;

        try {
            const res = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (res?.ok) {
                toast.success('Đăng nhập thành công', {
                    id: 'success-login',
                });
                router.push('/');
            }

            if (res?.error) {
                toast.error(res.error);
            }
        } catch (error: any) {
            console.log('Error login with crenditals');
            toast.error('Đã có lỗi xảy ra khi đăng nhập', {
                id: 'error-login',
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(loginWithCrenditals)}>
            <div className="flex flex-col space-y-1">
                <label htmlFor="username" className="">
                    Email
                </label>
                <input
                    className="focus:ring-blue-600 rounded-md border p-2 shadow-md focus:outline-none focus:ring-2"
                    type="text"
                    id="username"
                    autoComplete="off"
                    placeholder="Nhập email của bạn"
                    {...register('email', {
                        required: 'Hãy nhập email',
                    })}
                />
                {errors.email && <p className="">{errors.email.message}</p>}
            </div>

            <div className="flex flex-col space-y-1">
                <label htmlFor="password" className="mt-2 ">
                    Mật khẩu
                </label>
                <input
                    className="focus:ring-blue-600 rounded-md border p-2  shadow-md focus:outline-none focus:ring-2"
                    type="password"
                    id="password"
                    autoComplete="off"
                    placeholder="Nhập mật khẩu"
                    {...register('password', {
                        required: 'Hãy nhập mật khẩu',
                    })}
                />
                {errors.password && (
                    <p className="">{errors.password.message}</p>
                )}
            </div>

            <Button
                className="mt-6 h-10 w-full"
                type="submit"
                variant={'primary'}
                size={'default'}
                disabled={isSubmitting || isLoading}
            >
                {isSubmitting || isLoading ? (
                    <Icons.Loading className="animate-spin" />
                ) : (
                    <h5 className="text-lg">Đăng nhập</h5>
                )}
            </Button>
        </form>
    );
};
export default LoginForm;
