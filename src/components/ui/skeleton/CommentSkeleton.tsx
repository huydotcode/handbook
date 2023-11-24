import React from 'react';
import { FaReply } from 'react-icons/fa';

const CommentSkeleton = () => {
    return (
        <div className="mb-4">
            <div className="flex justify-between">
                <div className="w-8 h-8 rounded-full bg-light-100 animate-skeleton dark:bg-dark-500"></div>

                <div className="flex flex-col flex-1 max-w-[calc(100%-32px)] ml-2">
                    {/* Content */}
                    <div className="relative w-fit">
                        <div className="bg-light-100 w-[100px] h-[28px] px-4 py-1 rounded-md break-all animate-skeleton dark:bg-dark-500"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default CommentSkeleton;
