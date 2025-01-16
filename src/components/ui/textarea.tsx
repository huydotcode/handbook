import * as React from 'react';

import { cn } from '@/lib/utils';

const Textarea = React.forwardRef<
    HTMLTextAreaElement,
    React.ComponentProps<'textarea'>
>(({ className, ...props }, ref) => {
    function textAreaAdjust(element: HTMLTextAreaElement | null) {
        if (!element) return;

        if (element.value === '') {
            element.style.height = '40px';
            return;
        }

        element.style.height = '1px';
        element.style.height = 4 + element.scrollHeight + 'px';
    }

    return (
        <textarea
            className={cn(
                'no-scrollbar flex h-10 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                className
            )}
            onKeyDown={(e) => textAreaAdjust(e.currentTarget)}
            ref={ref}
            {...props}
        />
    );
});
Textarea.displayName = 'Textarea';

export { Textarea };
