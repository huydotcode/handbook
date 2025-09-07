import React from 'react';
import Sidebar from './_components/Sidebar';

interface SearchLayoutProps {
    children: React.ReactNode;
}

const SearchLayout = async ({ children }: SearchLayoutProps) => {
    return (
        <>
            <Sidebar />
            <div
                className={
                    'ml-[300px] mt-[56px] min-h-[calc(100vh-56px)] bg-primary-1 dark:bg-dark-primary-1 lg:ml-0'
                }
            >
                <div className={'mx-auto mt-[64px] max-w-[800px] px-4 md:px-2'}>
                    {children}
                </div>
            </div>
        </>
    );
};

export default SearchLayout;
