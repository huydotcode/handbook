'use client';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useState } from 'react';
import { formatMoney } from '@/utils/formatMoney';
import { Button } from '@/components/ui/Button';
import { ConfirmModal, Icons } from '@/components/ui';
import { deleteItem } from '@/lib/actions/item.action';
import toast from 'react-hot-toast';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import FileUploader from '@/components/shared/FileUploader';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useCategories, useLocations } from '@/context/AppContext';

interface Props {
    data: IItem;
    isManage?: boolean;
}

interface ItemData {
    name: string;
    price: number;
    location: string;
    description: string;
    images: any[];
    category: string;
}

const Item: React.FC<Props> = ({ data: item, isManage = false }) => {
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState<boolean>(false);
    const form = useForm<ItemData>({
        defaultValues: {
            name: item.name,
            price: item.price,
            location: item.location,
            description: item.description,
            images: item.images.map((image) => image.url),
            category: item.category._id,
        },
    });

    const { data: categories } = useCategories();
    const { data: locations } = useLocations();

    const handleChange = (files: File[]) => {
        form.setValue('images', files);
    };

    const handleDeleteItem = async (item: IItem | undefined) => {
        if (!item) return;

        try {
            await deleteItem({ itemId: item?._id });
        } catch (error: any) {
            toast.error('Xóa mặt hàng thất bại', {
                id: 'delete-item',
            });
        }
    };

    const onSubmit: SubmitHandler<ItemData> = async (
        data: ItemData | undefined
    ) => {};

    return (
        <>
            <div>
                <Button
                    variant={'ghost'}
                    className="relative flex h-[300px] w-full cursor-pointer flex-col items-start justify-start border bg-secondary-1 hover:bg-hover-1 dark:border-none dark:bg-dark-secondary-1 dark:hover:bg-dark-hover-1"
                    key={item._id}
                    href={`/market/item/${item._id}`}
                >
                    <div className="relative flex max-h-[30vh] min-h-[150px] w-full items-center">
                        <Image
                            className={'object-contain'}
                            src={item.images[0].url || ''}
                            alt={item.name || ''}
                            fill={true}
                            quality={100}
                        />
                    </div>

                    <div className="flex w-full flex-1 flex-col justify-between">
                        <div className={'mb-8 flex flex-col'}>
                            <p className="mt-1 whitespace-pre-wrap text-xs">
                                {item.name}
                            </p>

                            <span className="text-xs text-secondary-1">
                                {item.location}
                            </span>
                        </div>

                        <div className={'flex justify-between'}>
                            <span className="text-end text-base font-medium">
                                {formatMoney(item.price)}
                            </span>
                        </div>
                    </div>
                </Button>

                {isManage && (
                    <div className={'flex items-center gap-2 p-2'}>
                        <Button
                            onClick={() =>
                                setOpenDeleteConfirm((prev) => !prev)
                            }
                            variant={'warning'}
                        >
                            <Icons.Delete />
                        </Button>

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant={'secondary'}>
                                    <Icons.Edit />
                                </Button>
                            </DialogTrigger>

                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Chỉnh sửa {item.name}
                                    </DialogTitle>
                                </DialogHeader>

                                <Form {...form}>
                                    <form
                                        className="rounded-xl bg-secondary-1 p-6 dark:bg-dark-secondary-1"
                                        onSubmit={form.handleSubmit(onSubmit)}
                                    >
                                        <h1
                                            className={
                                                'mb-4 text-center text-2xl font-semibold text-primary-1 dark:text-dark-primary-1'
                                            }
                                        >
                                            Cập nhật sản phẩm
                                        </h1>

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
                                                    <FormItem
                                                        className={'flex-1'}
                                                    >
                                                        <FormLabel>
                                                            Tên
                                                        </FormLabel>
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
                                                        <FormLabel>
                                                            Giá
                                                        </FormLabel>
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
                                                        <FormLabel>
                                                            Danh mục
                                                        </FormLabel>
                                                        <Select
                                                            onValueChange={
                                                                field.onChange
                                                            }
                                                            defaultValue={
                                                                field.value
                                                            }
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
                                                    <FormItem
                                                        className={'flex-1'}
                                                    >
                                                        <FormLabel>
                                                            Địa điểm
                                                        </FormLabel>
                                                        <Select
                                                            onValueChange={
                                                                field.onChange
                                                            }
                                                            defaultValue={
                                                                field.value
                                                            }
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
                                                                                location.name
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
                                                disabled={
                                                    form.formState.isSubmitting
                                                }
                                                type={'submit'}
                                            >
                                                Tạo sản phẩm
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}
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

export default Item;
