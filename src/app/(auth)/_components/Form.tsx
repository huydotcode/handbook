'use client';
import { Button, Icons } from '@/components/ui';
import logger from '@/utils/logger';
import { signIn } from 'next-auth/react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import Image from 'next/image';

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
        <div className="bg-glass w-[400px] max-w-screen rounded-xl px-10 py-10 shadow-lg">
            <h2 className="flex justify-center text-center text-2xl font-semibold uppercase tracking-tight">
                {isLoginForm ? 'Đăng nhập' : 'Đăng ký'}
            </h2>

            <div className="mt-4 flex w-full flex-col">
                {isLoginForm ? (
                    <LoginForm />
                ) : (
                    <SignupForm setIsLoginForm={setIsLoginForm} />
                )}
            </div>

            <div className={'my-6 h-[1px] w-full bg-secondary-2'}></div>

            <Button
                className="w-full"
                size={'large'}
                onClick={loginWithGoogle}
                disabled={isLoading}
            >
                <Icons.Google className="mr-2" />
                <h5 className="text-base">Đăng nhập với Google</h5>
            </Button>

            <div className="flex items-center justify-center">
                <h5 className={'text-sm text-secondary-1'}>
                    {isLoginForm ? 'Chưa' : 'Đã'} có tài khoản?
                </h5>
                <Button
                    className="text-sm font-bold text-primary-2"
                    variant={'text'}
                    size={'medium'}
                    onClick={() => setIsLoginForm((prev) => !prev)}
                >
                    {isLoginForm ? 'Đăng ký' : 'Đăng nhập'} ngay
                </Button>
            </div>
        </div>
    );
};
export default Form;
