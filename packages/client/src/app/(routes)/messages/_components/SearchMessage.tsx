'use client';
import Message from '@/app/(routes)/messages/_components/Message';
import { Icons, Loading } from '@/components/ui';
import useBreakpoint from '@/hooks/useBreakpoint';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import SideHeader from './SideHeader';
import { Button } from '@/components/ui/Button';
import { Form, FormField } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import axiosInstance from '@/lib/axios';
import { API_ROUTES } from '@/config/api';

interface Props {
    openSearch: boolean;
    conversationId: string;
    setOpenSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchMessage: React.FC<Props> = ({
    openSearch,
    conversationId,
    setOpenSearch,
}) => {
    const router = useRouter();

    const [search, setSearch] = useState<string>('');
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [searchMessages, setSearchMessages] = useState<IMessage[]>([]);
    const [loadingSearch, setLoadingSearch] = useState<boolean>(false);

    const searchMessage = useCallback(async () => {
        try {
            setIsSearching(true);

            const searchValue = search.trim().toLowerCase();

            if (!searchValue) return;

            setSearchMessages([]);

            const res = await axiosInstance.get(API_ROUTES.MESSAGES.SEARCH, {
                params: {
                    q: searchValue,
                    conversation_id: conversationId,
                },
            });

            const data = res.data;
            setSearchMessages(data);
        } catch (error: any) {
            toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
        } finally {
            setIsSearching(false);
        }
    }, [search, conversationId]);

    const { breakpoint } = useBreakpoint();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search.trim() == '') {
                setSearchMessages([]);
            } else {
                searchMessage();
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [search, searchMessage]);

    return (
        <>
            <div className="relative ml-2 flex h-full max-h-[100vh-[64px]] w-full flex-1 flex-col overflow-hidden rounded-xl bg-white shadow-xl dark:bg-dark-secondary-1 dark:shadow-none md:flex-1 sm:ml-0">
                <SideHeader
                    handleClickBack={() => setOpenSearch(false)}
                    title="Tìm kiếm tin nhắn"
                />

                <div className="mt-2 flex flex-col px-4">
                    <div
                        className={
                            'flex items-center rounded-xl border bg-primary-1 px-2 dark:bg-dark-secondary-1'
                        }
                    >
                        <Icons.Search size={32} />

                        <Input
                            className={
                                'bg-transparent text-sm placeholder:text-xs placeholder:text-secondary-1'
                            }
                            placeholder="Tìm kiếm tin nhắn"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <Button type={'submit'} className={'hidden'}></Button>

                        <Button
                            onClick={() => {
                                setSearch('');
                                setSearchMessages([]);
                            }}
                            variant={'text'}
                            size={'xs'}
                        >
                            <Icons.Close size={18} />
                        </Button>
                    </div>
                    <h5 className={'mt-2 text-xs text-secondary-1'}>
                        Kết quả: {searchMessages.length} tin nhắn
                    </h5>

                    {loadingSearch && (
                        <Loading
                            fullScreen
                            overlay
                            text={'Đang tìm tin nhắn'}
                        />
                    )}

                    <div className="mt-2 flex flex-col items-center">
                        {isSearching && (
                            <div className="absolute left-1/2 -translate-x-1/2 text-3xl">
                                <Icons.Loading />
                            </div>
                        )}

                        {searchMessages.map((message) => (
                            <Message
                                key={message._id}
                                data={message}
                                messages={searchMessages}
                                handleClick={() => {
                                    setLoadingSearch(true);

                                    router.push(
                                        `/messages/${message.conversation._id}?find_msg=${message._id}`
                                    );

                                    if (breakpoint == 'sm') {
                                        setOpenSearch(false);
                                    }

                                    setLoadingSearch(false);
                                }}
                                isSearchMessage
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default SearchMessage;
