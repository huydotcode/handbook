'use client';
import { Button } from '@/components';
import { useRouter } from 'next/navigation';
import React from 'react';

interface Props {}

const RefreshButton: React.FC<Props> = ({}) => {
    const router = useRouter();

    return (
        <Button
            variant={'text'}
            size={'small'}
            onClick={() => router.refresh()}
        >
            Tải mới
        </Button>
    );
};
export default RefreshButton;
