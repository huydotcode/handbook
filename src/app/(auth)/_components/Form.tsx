'use client';
import { Button, Icons } from '@/components/ui';
import logger from '@/utils/logger';
import { signIn } from 'next-auth/react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

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
                        className="ml-2 font-bold text-primary-2"
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
                <Icons.Google className="mr-2" />
                <h5 className="text-base">Đăng nhập với Google</h5>
            </Button>
        </div>
    );
};
export default Form;
