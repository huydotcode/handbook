import { Icons } from '@/components/ui';
import { useDebounce } from '@/hooks';
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/Input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { IFilterConversation } from './Sidebar';

interface Props {
    setFilter: React.Dispatch<React.SetStateAction<IFilterConversation>>;
}

const SearchConversation: React.FC<Props> = ({ setFilter }) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>('');
    const debounceValue = useDebounce(searchValue, 500);

    // Xử lý với debounce value để lấy ra các cuộc trò chuyện
    useEffect(() => {
        setFilter((prev) => ({
            ...prev,
            query: debounceValue.trim(),
        }));
    }, [debounceValue, setFilter]);

    return (
        <>
            <div className="mt-2 flex items-center rounded-xl bg-primary-1 px-2 dark:bg-dark-primary-1 lg:justify-center lg:p-3 sm:px-2 sm:py-1">
                <Dialog>
                    <DialogTrigger>
                        <Icons.Search className={'hidden lg:block'} />
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Tìm kiếm cuộc trò chuyện</DialogTitle>
                        </DialogHeader>

                        <div className={'flex'}>
                            <Input
                                className="w-full border-none bg-primary-1 px-4 py-2 dark:bg-dark-primary-1 dark:placeholder:text-dark-primary-1"
                                value={searchValue}
                                placeholder="Tìm cuộc trò chuyện"
                                onChange={(e) => {
                                    setSearchValue(e.target.value);
                                }}
                            />
                        </div>
                    </DialogContent>
                </Dialog>

                <Icons.Search
                    className={
                        'dark:hover:text-dark-primary-2 block cursor-pointer hover:text-primary-2 lg:hidden'
                    }
                    onClick={() => setShowModal((prev) => !prev)}
                />

                <Input
                    className="bg-transparent text-sm dark:bg-transparent dark:text-dark-primary-1 dark:placeholder:text-dark-primary-1 lg:hidden sm:block"
                    value={searchValue}
                    placeholder="Tìm cuộc trò chuyện"
                    onChange={(e) => {
                        setSearchValue(e.target.value);
                    }}
                />
                {searchValue.length > 0 && (
                    <Icons.Close
                        className="cursor-pointer lg:hidden"
                        onClick={() => setSearchValue('')}
                    />
                )}
            </div>
        </>
    );
};

export default SearchConversation;
