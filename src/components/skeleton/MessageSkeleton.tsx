import React from 'react';

const MessageSkeleton = () => {
    return (
        <div className="flex w-full animate-pulse items-center gap-2 p-2">
            <div className="flex flex-grow flex-col">
                <div className="h-10 w-full rounded-xl bg-gray-300"></div>
            </div>
        </div>
    );
};

export default MessageSkeleton;
