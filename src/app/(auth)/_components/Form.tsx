'use client';
import { Button } from '@/components/ui';
import { signIn } from 'next-auth/react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import logger from '@/utils/logger';

interface Props {}

const Form: React.FC<Props> = ({}) => {
    const [isLoginForm, setIsLoginForm] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const loginWithGoogle = async () => {
        try {
            setIsLoading(true);
            await signIn('google');
        } catch (error) {
            logger({
                message: 'Error login with google' + error,
                type: 'error',
            });
            toast.error('Đăng nhập thất bại');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-glass flex w-full max-w-md flex-col items-center space-y-2 rounded-xl px-10 py-10 shadow-lg">
            <h2 className="text-center text-2xl tracking-tight">
                {isLoginForm ? 'Đăng nhập' : 'Đăng ký'} với Handbook
            </h2>

            <div className="flex w-full flex-col">
                {isLoginForm ? (
                    <LoginForm />
                ) : (
                    <SignupForm setIsLoginForm={setIsLoginForm} />
                )}

                <div className="mt-4 flex items-center justify-center">
                    <h5>Bạn {isLoginForm ? 'chưa' : 'đã'} có tài khoản?</h5>
                    <Button
                        className="ml-2 "
                        variant={'text'}
                        size={'medium'}
                        onClick={() => setIsLoginForm((prev) => !prev)}
                    >
                        {isLoginForm ? 'Đăng ký' : 'Đăng nhập'} ngay
                    </Button>
                </div>
            </div>

            <Button
                className="w-full"
                size={'large'}
                onClick={loginWithGoogle}
                disabled={isLoading}
            >
                <svg
                    className="mr-2 w-6"
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
export default Form;
