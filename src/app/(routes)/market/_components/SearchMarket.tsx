'use client';
import { Icons } from '@/components/ui';
import { useDebounce } from '@/hooks';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button';

interface Props {
    showFull: boolean;
    setShowFullSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchMarket: React.FC<Props> = ({ showFull, setShowFullSidebar }) => {
    const [searchValue, setSearchValue] = useState<string>('');
    const debounceValue = useDebounce(searchValue, 500);

    return (
        <>
            <div
                className={cn(
                    'mt-2 flex w-full items-center rounded-xl bg-primary-1 px-2 dark:bg-dark-primary-1',
                    {
                        'md:justify-center md:py-2 md:text-xl': !showFull,
                    }
                )}
            >
                <Dialog>
                    <DialogTrigger>
                        <Icons.Search className={'hidden lg:block'} />
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Tìm kiếm mặt hàng</DialogTitle>
                        </DialogHeader>

                        <div className={'flex'}>
                            <Input
                                className="w-full border-none bg-primary-1 px-4 py-2 dark:bg-dark-primary-1 dark:placeholder:text-dark-primary-1"
                                value={searchValue}
                                placeholder="Tìm mặt hàng"
                                onChange={(e) => {
                                    setSearchValue(e.target.value);
                                }}
                            />
                        </div>

                        <Button variant={'primary'} size={'md'}>
                            Tìm kiếm
                        </Button>
                    </DialogContent>
                </Dialog>

                <Icons.Search
                    className={'lg:hidden'}
                    onClick={() => {
                        setShowFullSidebar((prev) => !prev);
                    }}
                />

                <Input
                    className={cn(
                        'bg-transparent text-sm dark:text-dark-primary-1 dark:placeholder:text-dark-primary-1 md:hidden'
                    )}
                    value={searchValue}
                    placeholder="Tìm kiếm trên market"
                    onChange={(e) => {
                        setSearchValue(e.target.value);
                    }}
                />

                <Icons.Close
                    className={cn('cursor-pointer', {
                        hidden: !showFull,
                    })}
                    onClick={() => {
                        if (showFull) {
                            setShowFullSidebar(false);
                        }
                        setSearchValue('');
                    }}
                />
            </div>
        </>
    );
};

export default SearchMarket;
