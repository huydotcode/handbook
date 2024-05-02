import { Loading } from '@/components/ui';
import React from 'react';

const LoadingPage = () => {
    return (
        <div className="flex-1 rounded-xl bg-white shadow-xl dark:bg-dark-secondary-1 dark:shadow-none">
            <Loading />
        </div>
    );
};

export default LoadingPage;
