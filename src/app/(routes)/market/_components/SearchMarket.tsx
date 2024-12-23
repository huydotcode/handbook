import React, { useEffect, useState } from 'react';
import { Icons } from '@/components/ui';
import { useDebounce } from '@/hooks';
import { Input } from 'antd';
import { cn } from '@/lib/utils';

interface Props {
    showFull: boolean;
    setShowFullSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchMarket: React.FC<Props> = ({ showFull, setShowFullSidebar }) => {
    const [searchValue, setSearchValue] = useState<string>('');
    const debounceValue = useDebounce(searchValue, 500);

    // Xử lý với debounce value để lấy ra các cuộc trò chuyện
    useEffect(() => {}, [debounceValue]);

    return (
        <>
            <div
                className={cn(
                    'mt-2 flex w-full items-center rounded-xl bg-primary-1 px-2 py-1 dark:bg-dark-primary-1',
                    {
                        'md:justify-center md:py-2 md:text-xl': !showFull,
                    }
                )}
            >
                <Icons.Search
                    onClick={() => {
                        setShowFullSidebar((prev) => !prev);
                    }}
                />
                <Input
                    className={cn('dark:placeholder:text-dark-primary-1', {
                        'md:flex': showFull,
                        'md:hidden': !showFull,
                    })}
                    value={searchValue}
                    bordered={false}
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
