'use client';
import { Icons } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useDebounce } from '@/hooks';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

interface Props {
    className?: string;
}

const SearchMarket: React.FC<Props> = ({ className = '' }) => {
    const [searchValue, setSearchValue] = useState<string>('');
    const debounceValue = useDebounce(searchValue, 500);
    const router = useRouter();

    return (
        <>
            <div
                className={cn('mt-2 flex w-full items-center px-2 ', className)}
            >
                <Input
                    className={cn(
                        'rounded-l-xl rounded-r-none bg-primary-1 text-sm dark:bg-dark-primary-1 dark:text-dark-primary-1 dark:placeholder:text-dark-primary-1'
                    )}
                    value={searchValue}
                    placeholder="Tìm kiếm trên market"
                    onChange={(e) => {
                        setSearchValue(e.target.value);
                    }}
                />

                <Button
                    className="rounded-l-none rounded-r-xl"
                    variant={'secondary'}
                    onClick={() => {
                        if (debounceValue.trim() === '') return;
                        router.push(`/market/search/${debounceValue}`);
                    }}
                >
                    <Icons.Search />
                </Button>
            </div>
        </>
    );
};

export default SearchMarket;
