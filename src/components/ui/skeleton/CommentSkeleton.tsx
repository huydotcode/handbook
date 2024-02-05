const CommentSkeleton = () => {
    return (
        <div className="mb-4">
            <div className="flex justify-between">
                <div className="h-8 w-8 animate-skeleton rounded-full bg-light-100 dark:bg-dark-500"></div>

                <div className="ml-2 flex max-w-[calc(100%-32px)] flex-1 flex-col">
                    {/* Content */}
                    <div className="relative w-fit">
                        <div className="h-[28px] w-[100px] animate-skeleton break-all rounded-md bg-light-100 px-4 py-1 dark:bg-dark-500"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default CommentSkeleton;
