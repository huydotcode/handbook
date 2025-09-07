'use client';
import FileUploader from '@/components/shared/FileUploader';
import { ConfirmModal, Icons } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCategories, useLocations } from '@/context/AppContext';
import { useQueryInvalidation } from '@/hooks/useQueryInvalidation';
import ItemService from '@/lib/services/item.service';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface ItemData {
    name: string;
    price: number;
    location: string;
    description: string;
    images: any[];
    category: string;
}

interface Props {
    data: IItem;
}

const EditItem: React.FC<Props> = ({ data: item }) => {
    const { invalidateItemsBySeller } = useQueryInvalidation();
    const { data: session } = useSession();

    const [openDeleteConfirm, setOpenDeleteConfirm] = useState<boolean>(false);
    const form = useForm<ItemData>({
        defaultValues: {
            name: item.name,
            price: item.price,
            location: item.location.name,
            description: item.description,
            images: item.images.map((image) => image.url),
            category: item.category._id,
        },
    });
    const path = usePathname();

    const { data: categories } = useCategories();
    const { data: locations } = useLocations();

    const handleChange = (files: File[]) => {
        form.setValue('images', files);
    };

    const onSubmit: SubmitHandler<ItemData> = async (
        data: ItemData | undefined
    ) => {
        try {
            await ItemService.update({
                itemId: item._id,
                name: data?.name || '',
                description: data?.description || '',
                price: data?.price || 0,
                imagesIds: data?.images.map((image) => image.id) || [],
                location: data?.location || '',
                category: data?.category || '',
                status: item.status,
                path,
            });

            await invalidateItemsBySeller(session?.user.id as string);

            toast.success('Cập nhật mặt hàng thành công', {
                id: 'update-item',
            });
        } catch (error: any) {
            console.log(error);
            toast.error('Cập nhật mặt hàng thất bại', {
                id: 'update-item',
            });
        }
    };

    const handleDeleteItem = async (item: IItem | undefined) => {
        if (!item) return;

        try {
            await ItemService.delete({
                itemId: item._id,
                path,
            });

            await invalidateItemsBySeller(session?.user.id as string);

            toast.success('Xóa mặt hàng thành công');
        } catch (error: any) {
            toast.error('Xóa mặt hàng thất bại', {
                id: 'delete-item',
            });
        }
    };

    return (
        <>
            <div className={'flex items-center justify-end gap-2 p-2'}>
                <Button variant={'secondary'} href={`/market/item/${item._id}`}>
                    <Icons.Eye />
                </Button>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant={'secondary'}>
                            <Icons.Edit />
                        </Button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Chỉnh sửa {item.name}</DialogTitle>
                        </DialogHeader>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <FileUploader
                                    className={'mb-2'}
                                    handleChange={handleChange}
                                />

                                <div
                                    className={
                                        'flex w-full items-center gap-2 md:flex-col'
                                    }
                                >
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem className={'flex-1'}>
                                                <FormLabel>Tên</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        className={
                                                            'flex-1 bg-primary-1 dark:bg-dark-primary-1'
                                                        }
                                                        placeholder="Tên"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Giá</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        className={
                                                            'bg-primary-1 dark:bg-dark-primary-1'
                                                        }
                                                        placeholder="Giá"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem className={'mt-2'}>
                                            <FormLabel>Mô tả</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    className={
                                                        'bg-primary-1 dark:bg-dark-primary-1'
                                                    }
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div
                                    className={
                                        'mt-2 flex w-full items-center gap-2 md:flex-col'
                                    }
                                >
                                    <FormField
                                        control={form.control}
                                        name="category"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Danh mục</FormLabel>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger
                                                            className={
                                                                'min-w-[200px] bg-primary-1 dark:bg-dark-primary-1'
                                                            }
                                                        >
                                                            <SelectValue placeholder="Chọn một danh mục" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {categories?.map(
                                                            (
                                                                category: ICategory
                                                            ) => (
                                                                <SelectItem
                                                                    key={
                                                                        category._id
                                                                    }
                                                                    value={
                                                                        category._id
                                                                    }
                                                                >
                                                                    {
                                                                        category.name
                                                                    }
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="location"
                                        render={({ field }) => (
                                            <FormItem className={'flex-1'}>
                                                <FormLabel>Địa điểm</FormLabel>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger
                                                            className={
                                                                'flex-1 bg-primary-1 dark:bg-dark-primary-1'
                                                            }
                                                        >
                                                            <SelectValue placeholder="Chọn địa điểm" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {locations?.map(
                                                            (
                                                                location: ILocation
                                                            ) => (
                                                                <SelectItem
                                                                    key={
                                                                        location._id
                                                                    }
                                                                    value={
                                                                        location._id
                                                                    }
                                                                >
                                                                    {
                                                                        location.name
                                                                    }
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div
                                    className={
                                        'mt-4 flex w-full justify-center'
                                    }
                                >
                                    <Button
                                        variant={'primary'}
                                        disabled={form.formState.isSubmitting}
                                        type={'submit'}
                                    >
                                        Lưu thay đổi
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>

                <Button
                    onClick={() => setOpenDeleteConfirm((prev) => !prev)}
                    variant={'warning'}
                >
                    <Icons.Delete />
                </Button>
            </div>

            <ConfirmModal
                open={openDeleteConfirm}
                setShow={setOpenDeleteConfirm}
                onClose={() => setOpenDeleteConfirm(false)}
                onConfirm={() => handleDeleteItem(item)}
                title={'Xóa mặt hàng'}
                message={'Bạn có chắc xóa mặt hàng này không'}
                confirmText={'Có'}
                cancelText={'Hủy'}
            />
        </>
    );
};

export default EditItem;
