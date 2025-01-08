import { InfinityPostComponent } from '@/components/post';
import React from 'react';
import { Sidebar } from './_components';

const GroupsPage = async () => {
    return (
        <div>
            <Sidebar />
            <div className="ml-[400px] mt-[56px] min-h-[calc(100vh-56px)] bg-primary-1 dark:bg-dark-primary-1 lg:ml-[80px]">
                <InfinityPostComponent
                    className="mx-auto mt-4 max-w-[700px] xl:max-w-[600px] lg:max-w-[600px] md:mx-2"
                    title="Hoạt động gần đây"
                    type="group"
                />
            </div>
        </div>
    );
};
export default GroupsPage;
