import React, { useEffect, useState } from 'react';
import { Icons, Modal } from '@/components/ui';
import { useDebounce } from '@/hooks';
import { Input } from 'antd';
import { viewport } from '@popperjs/core';

interface Props {
    initConversations: IConversation[];
    setConversations: React.Dispatch<React.SetStateAction<IConversation[]>>;
}

const SearchConversation: React.FC<Props> = ({
    initConversations,
    setConversations,
}) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>('');
    const debounceValue = useDebounce(searchValue, 500);

    // Xử lý với debounce value để lấy ra các cuộc trò chuyện
    useEffect(() => {
        setConversations(() => {
            return initConversations.filter((conversation) => {
                return (
                    conversation.participants.find((part) => {
                        return part.user.name
                            .toLowerCase()
                            .includes(debounceValue.toLowerCase());
                    }) ||
                    conversation.title
                        .toLowerCase()
                        .includes(debounceValue.toLowerCase())
                );
            });
        });
    }, [debounceValue]);

    return (
        <>
            <div className="mt-2 flex items-center rounded-xl bg-primary-1 px-2 py-1 dark:bg-dark-primary-1 lg:justify-center lg:p-3">
                <Icons.Search className={'lg:hidden'} />

                <Icons.Search
                    className={
                        'dark:hover:text-dark-primary-2 hidden cursor-pointer hover:text-primary-2 lg:block'
                    }
                    onClick={() => setShowModal((prev) => !prev)}
                />

                <Input
                    className="dark:placeholder:text-dark-primary-1 lg:hidden"
                    value={searchValue}
                    bordered={false}
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
                        <Input
                            className="dark:placeholder:text-dark-primary-1"
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
