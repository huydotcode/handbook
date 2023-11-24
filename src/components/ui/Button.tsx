import * as React from 'react';
import Link from 'next/link';
import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
    'flex items-center justify-center text-black dark:text-white disabled:bg-gray-500 disabled:cursor-not-allowed dark:shadow-none',
    {
        variants: {
            variant: {
                default: 'rounded-xl shadow-md',
                contained: 'bg-primary hover:bg-[rgb(61,61,236)]',
                outlined:
                    'border border-primary hover:border-transparent hover:bg-primary hover:text-white',
                text: 'text-xs hover:underline',
                event: 'rounded-xl p-2 bg-light-100 hover:bg-gray-300 dark:bg-[rgba(255,255,255,.1)] dark:hover:bg-[#6a6b6c]',
                custom: '',
                warning: 'bg-red-500 hover:bg-red-700 rounded-xl shadow-md',
                secondary: 'bg-gray-400 hover:bg-gray-500 rounded-xl',
            },
            size: {
                default: 'text-2xl p-2',
                tiny: 'text-xs p-1',
                small: 'text-sm p-2',
                medium: 'text-base p-3',
                large: 'text-4xl p-4',
                none: '',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    href?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, children, href, variant, size, ...props }, ref) => {
        if (href) {
            return (
                <Link
                    href={href}
                    className={cn(buttonVariants({ variant, size, className }))}
                >
                    {children}
                </Link>
            );
        }

        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            >
                {children}
            </button>
        );
    }
);
Button.displayName = 'Button';

export default Button;
