'use client';
import { Button, Icons } from '@/components/ui';
import { Input, InputRef } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

interface Props {
    setOpenSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchMessage: React.FC<Props> = ({ setOpenSearch }) => {
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<InputRef>(null);
    const [searchValue, setSearchValue] = useState<string>('');
    const searchMessages = []; // TODO: searchMessages

    // Xử lý click ngoài khung tìm kiếm
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(e.target as Node)
            ) {
                setOpenSearch(false);
                setSearchValue('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="absolute right-2 top-2 z-10 " ref={searchRef}>
            <div
                className={
                    'flex items-center rounded-xl border bg-primary-1 px-2 dark:bg-dark-secondary-1'
                }
            >
                <Icons.Search size={24} />
                <Input
                    className={
                        'dark:text-dark-primary-1 dark:placeholder:text-secondary-2'
                    }
                    ref={inputRef}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Tìm kiếm tin nhắn"
                    bordered={false}
                />
                <Button
                    onClick={() => {
                        setOpenSearch(false);
                        setSearchValue('');
                    }}
                    variant={'default'}
                    border={false}
                >
                    <Icons.Close size={18} />
                </Button>
            </div>

            <h5 className={'mt-2 text-xs text-secondary-1'}>
                Kết quả: {searchMessages.length} tin nhắn
            </h5>
        </div>
    );
};

export default SearchMessage;
