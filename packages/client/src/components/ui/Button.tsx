'use client';
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import Link from 'next/link';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm text-primary-1 dark:text-dark-primary-1 font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
    {
        variants: {
            variant: {
                default:
                    'rounded-xl shadow-md text-primary-1 hover:bg-hover-1 dark:bg-dark-secondary-1 dark:hover:bg-dark-hover-1',
                primary:
                    'bg-primary-2 rounded-xl text-white hover:bg-hover-blue',
                destructive:
                    'bg-destructive text-destructive-foreground hover:bg-destructive/90',
                outline:
                    'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
                secondary:
                    'bg-secondary-2 text-primary-1 hover:bg-hover-secondary dark:bg-dark-secondary-2 dark:hover:bg-hover-secondary-dark',
                ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-dark-primary-1 dark:hover:text-accent-foreground',
                link: 'text-primary underline-offset-4 hover:underline',
                custom: '',
                warning:
                    'rounded-xl shadow-md bg-warning text-white hover:bg-hover-warning',
                event: 'rounded-xl p-2 hover:bg-hover-2 dark:bg-dark-secondary-1 dark:hover:bg-dark-hover-1',
                text: 'hover:underline',
            },
            size: {
                default: 'h-10 px-4 py-2 text-base',
                xs: 'h-8 px-2 text-xs',
                sm: 'h-9 rounded-xl px-3 text-sm',
                md: 'h-10 rounded-xl px-4 text-md',
                lg: 'h-11 rounded-xl px-8 text-lg',
                xl: 'h-12 rounded-xl px-8 text-xl',
                '2xl': 'h-14 rounded-xl px-8 text-2xl',
                icon: 'h-10 w-10',
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
    asChild?: boolean;
    href?: string;
    border?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        if (props.href) {
            return (
                <Link
                    className={cn(buttonVariants({ variant, size, className }))}
                    href={props.href}
                >
                    {props.children}
                </Link>
            );
        }

        const Comp = asChild ? Slot : 'button';

        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                type={props.type == 'submit' ? 'submit' : 'button'}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
