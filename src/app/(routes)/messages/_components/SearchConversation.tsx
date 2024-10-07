import { Icons } from '@/components/ui';
import { useDebounce } from '@/hooks';
import { Conversation } from '@/models';
import { Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

interface Props {
    initConversations: IConversation[];
    setConversations: React.Dispatch<React.SetStateAction<IConversation[]>>;
}

const SearchConversation: React.FC<Props> = ({
    initConversations,
    setConversations,
}) => {
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
            <div className="px-4 py-2">
                <h1 className="text-2xl font-bold">Trò chuyện</h1>
                <div className="mt-2 flex items-center rounded-xl bg-primary-1 px-2 py-1">
                    <Icons.Search />
                    <Input
                        value={searchValue}
                        bordered={false}
                        placeholder="Tìm cuộc trò chuyện"
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
            </div>
        </>
    );
};

export default SearchConversation;
