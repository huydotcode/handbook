'use client';
import useDebounce from '@/hooks/useDebounce';
import { fetchUsers } from '@/lib/actions/user.action';
import { Fade, Modal } from '@mui/material';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import UserItem from '../search/UserItem';
import Button from '../ui/Button';
import Icons from '../ui/Icons';
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
    const inputRef = useRef() as React.RefObject<HTMLInputElement>;
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPagesize] = useState<number>(5);
    const handleClose = useCallback(() => {
        setSearchResult([]);
        setSearchValue('');
        setShowModal(false);
    }, []);

    const handleChangeInput = useCallback((e: any) => {
        setSearchValue(e.target.value);
    }, []);

    // Fetch search data
    useEffect(() => {
        const fetchSearchData = async (value: string) => {
            setIsSearching(true);

            if (!session?.user.id) return;

            try {
                const { users, isNext } = await fetchUsers({
                    userId: session?.user.id,
                    pageNumber: page,
                    pageSize: pageSize,
                    searchString: value,
                    sortBy: 'desc',
                });
                setSearchResult(users);
            } catch (error: any) {
                throw new Error(error);
            } finally {
                setIsSearching(false);
            }
        };

        if (debounceValue.trim().length > 0) {
            fetchSearchData(debounceValue);
        }
    }, [debounceValue, page, pageSize, session?.user.id]);

    return (
        <>
            <div
                className={
                    'ml-3 flex h-10 items-center justify-center rounded-full bg-secondary px-3 dark:bg-dark-100 ' +
                    className
                }
                onClick={() => {
                    setShowModal(true);
                }}
            >
                {/* PC icon */}
                <div className="text-input-color flex items-center text-lg lg:hidden">
                    <Icons.Search />
                </div>

                {/* Mobile icon*/}
                <label
                    className="text-input-color hidden cursor-pointer items-center text-lg lg:flex"
                    onClick={() => setShowModal((prev) => !prev)}
                >
                    <Icons.Search />
                </label>

                {/* Search-input */}
                <div
                    ref={inputRef}
                    className="h-10 min-w-[170px] bg-transparent px-2 text-xs lg:hidden"
                >
                    <div className="flex h-full items-center bg-secondary text-secondary dark:bg-dark-100  dark:placeholder:text-dark-100">
                        Tìm kiếm trên Handbook
                    </div>
                </div>
            </div>

            <Modal
                open={showModal}
                onClose={handleClose}
                className="flex items-center justify-center"
                disableAutoFocus
            >
                <Fade in={showModal}>
                    <div className="relative my-auto h-[60vh] w-[400px] rounded-xl bg-white px-4 py-2 pt-6 dark:bg-dark-200 md:h-full md:w-full md:rounded-none">
                        <Button
                            className="absolute right-2 top-4 z-20 flex items-center justify-center rounded-full text-3xl"
                            variant={'custom'}
                            onClick={handleClose}
                        >
                            <Icons.Close />
                        </Button>

                        <div className="mx-auto mt-4 flex w-[80%] rounded-xl bg-light-100 px-2 dark:bg-dark-100">
                            <div className="text-input-color flex items-center text-lg">
                                <Icons.Search />
                            </div>

                            <input
                                ref={inputRef}
                                value={searchValue}
                                onChange={handleChangeInput}
                                name="q"
                                className="dark:placeholder:text-dark-200 h-10 w-full bg-transparent px-2 text-base"
                                dir="ltr"
                                placeholder="Tìm kiếm trên Handbook"
                                autoComplete="off"
                                spellCheck="false"
                            />
                        </div>

                        {searchResult.length > 0 &&
                            debounceValue.trim().length > 0 && (
                                <>
                                    <div className="dark:no-scrollbar mt-4 w-full overflow-scroll">
                                        {searchResult.map((user: IUser) => {
                                            return (
                                                <UserItem
                                                    key={user._id}
                                                    data={user}
                                                    handleHideModal={() => {
                                                        handleClose();
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
                                <Icons.Loading className="animate-spin text-6xl" />
                            </div>
                        )}
                    </div>
                </Fade>
            </Modal>
        </>
    );
};

export default Searchbar;
