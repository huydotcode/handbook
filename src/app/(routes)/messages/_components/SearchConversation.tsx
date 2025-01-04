import { Icons, Modal } from '@/components/ui';
import { useDebounce } from '@/hooks';
import { Input } from 'antd';
import React, { useEffect, useState } from 'react';

interface Props {
    setFilter: React.Dispatch<React.SetStateAction<string>>;
}

const SearchConversation: React.FC<Props> = ({ setFilter }) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>('');
    const debounceValue = useDebounce(searchValue, 500);

    // Xử lý với debounce value để lấy ra các cuộc trò chuyện
    useEffect(() => {
        setFilter(debounceValue);
    }, [debounceValue]);

    return (
        <>
            <div className="mt-2 flex items-center rounded-xl bg-primary-1 px-2 py-1 dark:bg-dark-primary-1 lg:justify-center lg:p-3 sm:px-2 sm:py-1">
                <Icons.Search className={'lg:hidden sm:block'} />

                <Icons.Search
                    className={
                        'dark:hover:text-dark-primary-2 hidden cursor-pointer hover:text-primary-2 lg:block sm:hidden'
                    }
                    onClick={() => setShowModal((prev) => !prev)}
                />

                <input
                    className="border-none bg-transparent px-2 py-1 dark:text-dark-primary-1 dark:placeholder:text-dark-primary-1 lg:hidden sm:block"
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

                <Modal
                    show={showModal}
                    handleClose={() => setShowModal(false)}
                    title="Tìm kiếm cuộc trò chuyện"
                >
                    <div className={'flex'}>
                        <input
                            className="w-full border-none bg-primary-1 px-4 py-2 dark:bg-dark-primary-1 dark:placeholder:text-dark-primary-1"
                            value={searchValue}
                            placeholder="Tìm cuộc trò chuyện"
                            onChange={(e) => {
                                setSearchValue(e.target.value);
                            }}
                        />
                    </div>
                </Modal>
            </div>
        </>
    );
};

export default SearchConversation;
