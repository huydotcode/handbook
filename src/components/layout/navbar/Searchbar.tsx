'use client';
import Items from '@/components/shared/Items';
import useDebounce from '@/hooks/useDebounce';
import { getUsers } from '@/lib/actions/user.action';
import { cn } from '@/lib/utils';
import logger from '@/utils/logger';
import { Collapse } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Button from '../../ui/Button';
import Icons from '../../ui/Icons';

interface Props {
    className?: string;
}

const Searchbar: React.FC<Props> = ({ className }) => {
    const { data: session } = useSession();
    const [showModal, setShowModal] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const debounceValue = useDebounce(searchValue, 300);
    const inputRef = useRef(null) as React.RefObject<HTMLInputElement | null>;
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPagesize] = useState<number>(5);

    const router = useRouter();

    // Xử lý khi thay đổi input
    const handleChangeInput = useCallback((e: any) => {
        setSearchValue(e.target.value);
    }, []);

    // Xử lý khi đóng modal
    const handleClose = useCallback(() => {
        setSearchResult([]);
        setSearchValue('');
        setShowModal(false);
    }, []);

    // Fetch dữ liệu khi search
    useEffect(() => {
        const fetchSearchData = async (value: string) => {
            setIsSearching(true);

            if (!session?.user.id) return;

            try {
                const { users, isNext } = await getUsers({
                    userId: session?.user.id,
                    pageNumber: page,
                    pageSize: pageSize,
                    searchString: value,
                    sortBy: 'desc',
                });
                setSearchResult(users);
            } catch (error: any) {
                logger({
                    message: 'Error fetch search data' + error,
                    type: 'error',
                });
            } finally {
                setIsSearching(false);
            }
        };

        if (debounceValue.trim().length > 0) {
            fetchSearchData(debounceValue);
        }
    }, [debounceValue, page, pageSize, session?.user.id]);

    // Đóng modal khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setShowModal(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <div
                className={cn(
                    'ml-3 flex h-10 items-center justify-center rounded-full bg-primary-1 px-3 dark:bg-dark-secondary-2',
                    className
                )}
                onClick={() => {
                    setShowModal(true);
                }}
            >
                {/* PC icon */}
                <div className="flex items-center text-lg lg:hidden">
                    <Icons.Search />
                </div>

                {/* Mobile icon*/}
                <label
                    className="hidden cursor-pointer items-center text-lg lg:flex"
                    onClick={() => setShowModal((prev) => !prev)}
                >
                    <Icons.Search />
                </label>

                <input
                    className="h-10 min-w-[170px] bg-transparent px-2 text-sm lg:hidden"
                    placeholder={'Tìm kiếm trên Handbook'}
                    value={searchValue}
                    onChange={handleChangeInput}
                    name="q"
                    dir="ltr"
                    autoComplete="off"
                    spellCheck="false"
                />
            </div>

            <Collapse in={showModal}>
                <div
                    className={
                        'fixed left-0 top-0 z-10 min-h-[200px] rounded-b-xl bg-secondary-1 p-1 pl-5 shadow-md dark:bg-dark-secondary-1'
                    }
                >
                    <div
                        className={
                            'flex h-12 w-full items-center bg-secondary-1 dark:bg-dark-secondary-1'
                        }
                    >
                        <Button
                            className="z-20 flex h-8 w-8 items-center justify-center rounded-full text-3xl"
                            variant={'custom'}
                            onClick={handleClose}
                        >
                            <Icons.Close />
                        </Button>

                        <div
                            className={cn(
                                'ml-3 flex h-10 items-center justify-center rounded-full bg-primary-1 px-3 dark:bg-dark-secondary-2',
                                className
                            )}
                            onClick={() => {
                                setShowModal(true);
                            }}
                        >
                            <div className="flex items-center text-lg">
                                <Icons.Search />
                            </div>

                            <input
                                className="h-10 min-w-[170px] bg-transparent px-2 text-sm"
                                placeholder={'Tìm kiếm trên Handbook'}
                                ref={inputRef}
                                value={searchValue}
                                onChange={handleChangeInput}
                                name="q"
                                dir="ltr"
                                autoComplete="off"
                                spellCheck="false"
                            />
                        </div>
                    </div>

                    <h5 className={'mt-2 text-sm'}>Kết quả</h5>

                    {searchResult.length > 0 &&
                        debounceValue.trim().length > 0 && (
                            <>
                                <div className="dark:no-scrollbar mt-2 w-full overflow-scroll">
                                    {searchResult.map((user: IUser) => {
                                        return (
                                            <Items.User
                                                data={user}
                                                key={user._id}
                                                handleHideModal={() => {
                                                    handleClose();
                                                    router.push(
                                                        `/profile/${user._id}`
                                                    );
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                            </>
                        )}

                    {!isSearching &&
                        searchResult.length === 0 &&
                        debounceValue.trim().length > 0 && (
                            <div className="mt-2 text-center text-sm">
                                Không có kết quả
                            </div>
                        )}

                    {isSearching && searchResult.length === 0 && (
                        <div className="mt-4 flex justify-center">
                            <Icons.Loading className="animate-spin text-2xl" />
                        </div>
                    )}
                </div>
            </Collapse>
        </>
    );
};

export default Searchbar;
