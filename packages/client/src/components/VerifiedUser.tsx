'use client';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Icons } from '@/components/ui';
import React from 'react';
import { cn } from '@/lib/utils';

interface Props {
    className?: string;
}

const VerifiedUser = ({ className = '' }: Props) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span className={cn(className)}>
                        <Icons.Verified />
                    </span>
                </TooltipTrigger>

                <TooltipContent>
                    <div className={'text-xs'}>Tài khoản đã được xác thực</div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default VerifiedUser;
