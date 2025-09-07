'use client';
import React from 'react';
import { InfinityPostComponent } from '@/components/post';
import { useSearchParams } from 'next/navigation';

const FeedsPage = () => {
    const searchParams = useSearchParams();
    const filter = searchParams.get('filter') || '';
    const type =
        filter === 'friend'
            ? 'new-feed-friend'
            : filter === 'group'
              ? 'new-feed-group'
              : 'new-feed';

    return (
        <div className={'mx-auto w-[600px] max-w-screen md:w-full'}>
            <InfinityPostComponent showCreatePost={false} type={type} />
        </div>
    );
};

export default FeedsPage;
