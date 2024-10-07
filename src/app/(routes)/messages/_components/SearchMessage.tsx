import { Icons } from '@/components/ui';
import { useDebounce } from '@/hooks';
import { Input } from 'antd';
import React, { useState } from 'react';

interface Props {
    initMessages: IMessage[];
    setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
}

const SearchMessage: React.FC<Props> = ({ initMessages, setMessages }) => {
    const [init, setInit] = useState(initMessages);
    const [searchValue, setSearchValue] = useState<string>('');
    const debounceValue = useDebounce(searchValue, 500);

    const handleSearchMessage = () => {
        if (debounceValue.trim() == '') {
            setMessages(init);
            return;
        }

        setMessages(() => {
            return initMessages.filter((msg) =>
                msg.text.toLowerCase().includes(debounceValue.toLowerCase())
            );
        });
    };

    return (
        <div className="absolute right-4 top-20 z-10 flex items-center rounded-xl bg-primary-1 p-2">
            <Input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Tìm kiếm tin nhắn"
                bordered={false}
            />
            <Icons.Search size={24} onClick={handleSearchMessage} />
        </div>
    );
};

export default SearchMessage;
