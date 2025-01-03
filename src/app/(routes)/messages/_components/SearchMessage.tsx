'use client';
import { Button, Icons } from '@/components/ui';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Message from '@/app/(routes)/messages/_components/Message';
import { FormError, FormInput } from '@/components/ui/Form';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { getMessagesKey } from '@/lib/queryKey';
import useBreakpoint from '@/hooks/useBreakpoint';

interface Props {
    openSearch: boolean;
    conversationId: string;
    setOpenSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FormValues {
    search: string;
}

const SearchMessage: React.FC<Props> = ({
    openSearch,
    conversationId,
    setOpenSearch,
}) => {
    const router = useRouter();

    const { handleSubmit, register, reset, formState } = useForm<FormValues>({
        defaultValues: {
            search: '',
        },
    });
    const [searchMessages, setSearchMessages] = useState<IMessage[]>([]);

    const onSubmit = async (data: FormValues) => {
        const { search } = data;
        const searchValue = search.trim().toLowerCase();

        if (!searchValue) return;

        const res = await fetch(
            `/api/messages/search?search=${searchValue}&conversationId=${conversationId}`
        );

        if (res.ok) {
            const data = await res.json();
            setSearchMessages(data);
        }
    };

    const { breakpoint } = useBreakpoint();

    if (!openSearch) return null;

    return (
        <>
            <div className="relative ml-2 flex h-full max-h-screen w-[240px] flex-col overflow-y-scroll rounded-xl bg-white p-4 shadow-xl dark:bg-dark-secondary-1 dark:shadow-none md:flex-1">
                <div className={'flex items-center'}>
                    <Button
                        className="hidden md:block"
                        onClick={() => setOpenSearch(false)}
                        variant={'event'}
                    >
                        <Icons.ArrowBack size={24} />
                    </Button>

                    <h1>Tìm kiếm tin nhắn</h1>
                </div>

                <form
                    className={
                        'flex items-center rounded-xl border bg-primary-1 px-2 dark:bg-dark-secondary-1'
                    }
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Icons.Search size={32} />
                    <FormInput
                        {...register('search', {
                            required: 'Vui lòng nhập từ khóa',
                        })}
                        placeholder={'Enter để tìm'}
                        className="mt-0 w-full bg-transparent text-sm"
                    />

                    <Button
                        type={'submit'}
                        variant={'default'}
                        border={false}
                    ></Button>

                    <Button
                        onClick={() => {
                            reset();
                            setSearchMessages([]);
                        }}
                        variant={'default'}
                        border={false}
                    >
                        <Icons.Close size={18} />
                    </Button>
                </form>

                <h5 className={'mt-2 text-xs text-secondary-1'}>
                    Kết quả: {searchMessages.length} tin nhắn
                </h5>

                <div className="mt-2 flex flex-col items-center">
                    {formState.isSubmitting && (
                        <div className="absolute left-1/2 -translate-x-1/2 text-3xl">
                            <Icons.Loading />
                        </div>
                    )}

                    {searchMessages.map((message) => (
                        <Message
                            data={message}
                            messages={searchMessages}
                            handleClick={() => {
                                router.push(
                                    `/messages/${message.conversation._id}?findMessage=${message._id}`
                                );

                                if (breakpoint == 'sm') {
                                    setOpenSearch(false);
                                }
                            }}
                            isSearchMessage
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

export default SearchMessage;
