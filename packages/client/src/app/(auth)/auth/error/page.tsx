'use client';
import React from 'react';
import { Icons } from '@/components/ui';
import { Button } from '@/components/ui/Button';

const AuthErrorPage = () => {
    return (
        <div className="bg-glass relative mx-auto mt-12 flex w-[450px] max-w-screen flex-col items-center justify-center gap-6 rounded-xl px-6 py-10 shadow-lg">
            <div className="flex flex-col items-center gap-2">
                <Icons.Close className="text-red-500" size={48} />
                <h2 className="text-center text-2xl font-semibold">
                    Đã xảy ra lỗi xác thực
                </h2>
                <p className="max-w-xs text-center text-base text-secondary-1">
                    Phiên đăng nhập của bạn đã hết hạn hoặc có lỗi xảy ra trong
                    quá trình xác thực. Vui lòng thử lại.
                </p>
            </div>
            <Button
                href="/auth/login"
                variant="primary"
                size="lg"
                className="mt-2 w-full"
            >
                Quay lại đăng nhập
            </Button>
        </div>
    );
};

export default AuthErrorPage;
