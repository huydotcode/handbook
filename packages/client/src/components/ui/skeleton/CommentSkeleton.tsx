'use client';

const CommentSkeleton = () => {
    return (
        <div className="mb-4 h-10">
            <div className="flex justify-between">
                <div className=" h-8 w-8 animate-skeleton rounded-full "></div>

                <div className="ml-2 flex max-w-[calc(100%-32px)] flex-1 flex-col">
                    <div className="relative w-fit">
                        <div className=" h-[28px] w-[100px] animate-skeleton break-all rounded-md px-4 py-1 "></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default CommentSkeleton;
