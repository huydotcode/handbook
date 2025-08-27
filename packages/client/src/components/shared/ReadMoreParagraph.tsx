'use client';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface Props {
    className?: string;
    text: string;
    maxCharCount?: number;
}

const ReadMoreParagraph: React.FC<Props> = ({
    className,
    text,
    maxCharCount = 200,
}) => {
    const [isReadMore, setIsReadMore] = useState(true);
    const resultString = isReadMore ? text.slice(0, maxCharCount) : text;
    const toggleReadMore = () => {
        setIsReadMore(!isReadMore);
    };
    return (
        <p className={cn(className, 'text-justify')}>
            {resultString}
            {text.length > maxCharCount && (
                <span
                    className="cursor-pointer text-primary-2"
                    onClick={toggleReadMore}
                >
                    {isReadMore ? '...Hiển thị' : ' Ẩn bớt'}
                </span>
            )}
        </p>
    );
};

export default ReadMoreParagraph;
