import React from 'react';

interface Props {
    children: React.ReactNode;
}

export function generateMetadata() {
    return {
        title: 'Nhóm của bạn | Handbook',
    };
}

const GroupLayout: React.FC<Props> = async ({ children }) => {
    return (
        <div
            className={
                'ml-[300px] mt-[56px] min-h-[calc(100vh-56px)] bg-primary-1 dark:bg-dark-primary-1 md:ml-0'
            }
        >
            <div
                className={
                    'mx-auto mt-[64px] max-w-[1400px] px-4 2xl:px-12 xl:px-10 lg:px-8 md:px-6'
                }
            >
                {children}
            </div>
        </div>
    );
};

export default GroupLayout;
