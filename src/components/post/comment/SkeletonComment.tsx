const SkeletonComment = () => {
    return (
        <div className="flex space-x-2">
            <div className="h-8 w-8 animate-skeleton rounded-full bg-skeleton"></div>
            <div className="flex-1 space-y-2">
                <div className="h-10 w-3/4 animate-skeleton rounded-xl bg-skeleton"></div>
            </div>
        </div>
    );
};

export default SkeletonComment;
