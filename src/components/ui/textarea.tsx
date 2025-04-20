'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';

const Textarea = React.forwardRef<
    HTMLTextAreaElement,
    React.ComponentProps<'textarea'>
>(({ className, ...props }, ref) => {
    const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

    // Đồng bộ ref nội bộ với ref bên ngoài nếu có.
    React.useImperativeHandle(ref, () => textAreaRef.current!);

    // Hàm tự động điều chỉnh chiều cao của textarea.
    const textAreaAdjust = (element: HTMLTextAreaElement | null) => {
        if (!element) return;

        element.style.height = 'auto';
        element.style.height =
            element.scrollHeight <= 64 ? '40px' : `${element.scrollHeight}px`;
    };

    // Sự kiện onInput sẽ được gọi mỗi khi nội dung thay đổi.
    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
        textAreaAdjust(e.currentTarget);
        props.onInput && props.onInput(e);
    };

    return (
        <textarea
            ref={textAreaRef}
            className={cn(
                'no-scrollbar flex h-10 w-full resize-none rounded-md bg-background px-3 pt-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                className
            )}
            onInput={handleInput}
            {...props}
        />
    );
});
Textarea.displayName = 'Textarea';

export { Textarea };
