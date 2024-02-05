'use client';
import { Button } from '@/components/ui';
import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error;
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex h-screen items-center justify-center overflow-hidden">
            <h2>Đã có lỗi xảy ra vui lòng thử lại sau</h2>
            <Button onClick={() => reset()}>Thử lại</Button>
        </div>
    );
}
