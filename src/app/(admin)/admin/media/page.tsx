'use client';
import { ConfirmModal, Icons, Loading } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VideoPlayer from '@/components/ui/VideoPlayer';
import { deleteMedia, fetchAllMedias } from '@/lib/actions/admin/media.action';
import queryKey from '@/lib/queryKey';
import { timeConvert, timeConvert4 } from '@/utils/timeConvert';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useState } from 'react';
import toast from 'react-hot-toast';

const AdminMediaPage = () => {
    const {
        data: medias,
        isLoading,
        isFetching,
        refetch,
    } = useQuery<IMedia[]>({
        queryKey: queryKey.admin.media.index,
        queryFn: async () => {
            const medias = await fetchAllMedias({
                limit: 100, // You can adjust the limit as needed
                page: 1, // You can adjust the page as needed
            });

            return medias;
        },
        initialData: [],
    });

    const [openModalConfirmDelete, setOpenModalConfirmDelete] = useState(false);
    const [mediaIdToDelete, setMediaIdToDelete] = useState<string | null>(null);

    const handleDeleteMedia = async (mediaId: string) => {
        try {
            toast.promise(deleteMedia(mediaId), {
                loading: 'Đang xóa phương tiện...',
                success: 'Phương tiện đã được xóa thành công.',
                error: 'Xóa phương tiện không thành công. Vui lòng thử lại sau.',
            });

            setMediaIdToDelete(null);
            setOpenModalConfirmDelete(false);
            refetch(); // Refetch the media list after deletion
        } catch (error) {
            console.error('Error deleting media:', error);
            toast.error(
                'Xóa phương tiện không thành công. Vui lòng thử lại sau.'
            );
        }
    };

    const handleClickDelete = (mediaId: string) => {
        setMediaIdToDelete(mediaId);
        setOpenModalConfirmDelete(true);
    };

    // Gallery or list rendering logic can be added here
    return (
        <div>
            <h1 className="mb-4 text-2xl font-bold">Quản lý phương tiện</h1>

            <Tabs defaultValue="all" className="w-full">
                <TabsList>
                    <TabsTrigger value="all">Tất cả</TabsTrigger>
                    <TabsTrigger value="image">Hình ảnh</TabsTrigger>
                    <TabsTrigger value="video">Video</TabsTrigger>
                </TabsList>

                {['all', 'image', 'video'].map((tabValue) => {
                    const filteredMedias =
                        tabValue === 'all'
                            ? medias
                            : medias?.filter(
                                  (media) => media.resourceType === tabValue
                              );

                    return (
                        <TabsContent key={tabValue} value={tabValue}>
                            {!isLoading &&
                                !isFetching &&
                                filteredMedias?.length > 0 && (
                                    <div className="grid grid-cols-3 gap-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
                                        {filteredMedias.map((media) => (
                                            <div
                                                key={media._id}
                                                className="relative flex flex-col items-center justify-center rounded-xl bg-secondary-1 p-2 dark:bg-dark-secondary-1"
                                            >
                                                <Button
                                                    variant="secondary"
                                                    className="absolute right-2 top-2 z-10"
                                                    onClick={() =>
                                                        handleClickDelete(
                                                            media._id
                                                        )
                                                    }
                                                >
                                                    <Icons.Delete className="h-4 w-4" />
                                                </Button>

                                                <div className="relative mb-2 h-[300px] w-full overflow-hidden rounded-lg">
                                                    {media.resourceType ===
                                                    'image' ? (
                                                        <Image
                                                            src={media.url}
                                                            alt={media.url}
                                                            fill
                                                            className="h-full w-full object-contain object-center"
                                                        />
                                                    ) : (
                                                        <VideoPlayer
                                                            containerClassName="h-full w-full"
                                                            videoClassName="object-contain object-center"
                                                            src={media.url}
                                                        />
                                                    )}
                                                </div>

                                                <p className="mt-2 text-sm">
                                                    Người đăng{' '}
                                                    {media?.creator?.name ||
                                                        'Không xác định'}
                                                </p>
                                                <p className="text-xs">
                                                    Ngày đăng:{' '}
                                                    {timeConvert4(
                                                        media.createdAt.toString()
                                                    )}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                        </TabsContent>
                    );
                })}
            </Tabs>

            {(isLoading || isFetching) && <Loading fullScreen />}

            {!isLoading && !isFetching && (!medias || medias.length === 0) && (
                <div className="text-center">
                    <p className="text-gray-500">
                        Không có phương tiện nào được tìm thấy.
                    </p>
                </div>
            )}

            <ConfirmModal
                cancelText="Hủy"
                confirmText="Xóa"
                open={openModalConfirmDelete}
                message="Bạn có chắc chắn muốn xóa phương tiện này?"
                setShow={setOpenModalConfirmDelete}
                onClose={() => setOpenModalConfirmDelete(false)}
                onConfirm={() => {
                    if (mediaIdToDelete) {
                        handleDeleteMedia(mediaIdToDelete);
                    }
                    setOpenModalConfirmDelete(false);
                }}
                title="Xác nhận xóa phương tiện"
            />
        </div>
    );
};

export default AdminMediaPage;
