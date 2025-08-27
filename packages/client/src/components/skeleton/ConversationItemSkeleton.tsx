import React from 'react';

const ConversationItemSkeleton = () => {
    return (
        <div className="flex w-full animate-pulse items-center gap-2">
            <div className="flex flex-grow flex-col">
                <div className="h-12 w-full rounded-xl bg-secondary-2 dark:bg-dark-secondary-2"></div>
            </div>
        </div>
    );
};

export default ConversationItemSkeleton;
