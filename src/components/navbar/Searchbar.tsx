'use client';
import useDebounce from '@/hooks/useDebounce';
import { fetchUsers } from '@/lib/actions/user.action';
import { Fade, Modal } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CgSearchLoading } from 'react-icons/cg';
import { GoSearch } from 'react-icons/go';
import { IoClose } from 'react-icons/io5';
import UserItem from '../search/UserItem';
import Button from '../ui/Button';

const Searchbar = () => {
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
                className="flex items-center justify-center rounded-full h-10 ml-3 px-3 bg-secondary dark:bg-dark-100"
                onClick={() => {
                    setShowModal(true);
                }}
            >
                {/* PC icon */}
                <div className="lg:hidden flex items-center text-lg text-input-color">
                    <GoSearch />
                </div>

                {/* Mobile icon*/}
                <label
                    className="items-center text-lg text-input-color cursor-pointer hidden lg:flex"
                    onClick={() => setShowModal((prev) => !prev)}
                >
                    <GoSearch />
                </label>

                {/* Search-input */}
                <div
                    ref={inputRef}
                    className="lg:hidden min-w-[170px] h-10 px-2 text-xs bg-transparent"
                >
                    <div className="h-full flex items-center bg-secondary text-secondary dark:bg-dark-100  dark:placeholder:text-dark-100">
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
                    <div className="relative w-[400px] h-[60vh] px-4 py-2 pt-6 bg-white my-auto rounded-xl md:w-full md:h-full md:rounded-none dark:bg-dark-200">
                        <Button
                            className="absolute top-4 right-2 rounded-full flex items-center justify-center text-3xl z-20"
                            variant={'custom'}
                            onClick={handleClose}
                        >
                            <IoClose />
                        </Button>

                        <div className="flex w-[80%] mx-auto mt-4 px-2 rounded-xl bg-light-100 dark:bg-dark-100">
                            <div className="flex items-center text-lg text-input-color">
                                <GoSearch />
                            </div>

                            <input
                                ref={inputRef}
                                value={searchValue}
                                onChange={handleChangeInput}
                                name="q"
                                className="w-full h-10 px-2 text-base bg-transparent dark:placeholder:text-dark-200"
                                dir="ltr"
                                placeholder="Tìm kiếm trên Handbook"
                                autoComplete="off"
                                spellCheck="false"
                            />
                        </div>

                        {searchResult.length > 0 &&
                            debounceValue.trim().length > 0 && (
                                <>
                                    <div className="mt-4 w-full overflow-scroll dark:no-scrollbar">
                                        {searchResult.map((user: User) => {
                                            return (
                                                <UserItem
                                                    key={user.id}
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
                                <div className="text-center mt-2 text-sm">
                                    Không có kết quả
                                </div>
                            )}

                        {isSearching && searchResult.length === 0 && (
                            <div className="mt-4 flex justify-center">
                                <CgSearchLoading className="animate-skeleton text-6xl" />
                            </div>
                        )}
                    </div>
                </Fade>
            </Modal>
        </>
    );
};

export default Searchbar;
