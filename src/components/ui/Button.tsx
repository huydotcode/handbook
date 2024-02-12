'use client';
import * as React from 'react';
import Link from 'next/link';
import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
    'flex items-center justify-center disabled:cursor-not-allowed dark:shadow-none text-primary-1 dark:text-dark-primary-1 overflow:hidden',
    {
        variants: {
            variant: {
                default:
                    'rounded-xl shadow-md hover:bg-hover-1 dark:bg-dark-secondary-1 dark:hover:bg-dark-hover-1',
                primary:
                    'bg-primary-2 rounded-xl text-white hover:bg-hover-blue',
                contained: '',
                outlined: 'border hover:border-transparent hover:',
                text: 'hover:underline',
                event: 'rounded-xl p-2 hover:bg-hover-2 dark:bg-dark-secondary-1 dark:hover:bg-dark-hover-1',
                custom: '',
                warning:
                    'rounded-xl shadow-md bg-warning text-white hover:bg-hover-warning',
                secondary:
                    'rounded-xl bg-secondary-2 text-primary-1 hover:bg-hover-secondary dark:bg-dark-secondary-2 dark:hover:bg-hover-secondary-dark',
            },
            size: {
                default: 'text-sm p-2',
                small: 'text-xs p-2',
                medium: 'text-base p-3',
                large: 'text-2xl p-4',
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
    ({ className, children, href, variant, size, type, ...props }, ref) => {
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
