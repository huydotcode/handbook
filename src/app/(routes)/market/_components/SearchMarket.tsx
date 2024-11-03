import React, { useEffect, useState } from 'react';
import { Icons } from '@/components/ui';
import { useDebounce } from '@/hooks';
import { Input } from 'antd';

interface Props {}

const SearchMarket: React.FC<Props> = ({}) => {
    const [searchValue, setSearchValue] = useState<string>('');
    const debounceValue = useDebounce(searchValue, 500);

    // Xử lý với debounce value để lấy ra các cuộc trò chuyện
    useEffect(() => {}, [debounceValue]);

    return (
        <>
            <div className="mt-2 flex items-center rounded-xl bg-primary-1 px-2 py-1 dark:bg-dark-primary-1 md:justify-center md:p-3">
                <Icons.Search />
                <Input
                    className="dark:placeholder:text-dark-primary-1 md:hidden"
                    value={searchValue}
                    bordered={false}
                    placeholder="Tìm kiếm trên market"
                    onChange={(e) => {
                        setSearchValue(e.target.value);
                    }}
                />
                {searchValue.length > 0 && (
                    <Icons.Close
                        className="cursor-pointer"
                        onClick={() => setSearchValue('')}
                    />
                )}
            </div>
        </>
    );
};

export default SearchMarket;
