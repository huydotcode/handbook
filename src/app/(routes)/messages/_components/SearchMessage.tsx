'use client';
import Message from '@/app/(routes)/messages/_components/Message';
import { Icons, Loading } from '@/components/ui';
import useBreakpoint from '@/hooks/useBreakpoint';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import SideHeader from './SideHeader';
import { Button } from '@/components/ui/Button';
import { Form, FormField } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

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

    const form = useForm<FormValues>({
        defaultValues: {
            search: '',
        },
    });
    const { handleSubmit, reset, formState } = form;
    const [searchMessages, setSearchMessages] = useState<IMessage[]>([]);
    const [loadingSearch, setLoadingSearch] = useState<boolean>(false);

    const onSubmit = async (data: FormValues) => {
        const { search } = data;
        const searchValue = search.trim().toLowerCase();

        if (!searchValue) return;

        setSearchMessages([]);

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
            <div className="relative ml-2 flex h-full max-h-screen w-[240px] flex-col overflow-y-scroll rounded-xl bg-white shadow-xl dark:bg-dark-secondary-1 dark:shadow-none md:flex-1 sm:ml-0">
                <SideHeader
                    handleClickBack={() => setOpenSearch(false)}
                    title="Tìm kiếm tin nhắn"
                />

                <div className="mt-2 flex flex-col px-4">
                    <Form {...form}>
                        <form
                            className={
                                'flex items-center rounded-xl border bg-primary-1 px-2 dark:bg-dark-secondary-1'
                            }
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <Icons.Search size={32} />
                            <FormField
                                control={form.control}
                                name={'search'}
                                render={({ field }) => (
                                    <Input
                                        className={
                                            'bg-transparent text-sm placeholder:text-xs placeholder:text-secondary-1'
                                        }
                                        placeholder="Tìm kiếm tin nhắn"
                                        {...field}
                                    />
                                )}
                            />

                            <Button
                                type={'submit'}
                                className={'hidden'}
                            ></Button>

                            <Button
                                onClick={() => {
                                    reset();
                                    setSearchMessages([]);
                                }}
                                variant={'text'}
                                size={'xs'}
                            >
                                <Icons.Close size={18} />
                            </Button>
                        </form>
                    </Form>
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
                        {formState.isSubmitting && (
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
                                        `/messages/${message.conversation._id}?findMessage=${message._id}`
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
