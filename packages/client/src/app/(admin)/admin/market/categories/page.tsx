'use client';
import { ConfirmModal, Modal } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/Form';
import Icons, { IconsArray } from '@/components/ui/Icons';
import { Input } from '@/components/ui/Input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useCategories } from '@/context/AppContext';
import CategoryService from '@/lib/services/category.service';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface CategoryForm {
    name: string;
    description: string;
    slug: string;
    icon: string;
}

const AdminMarketCategoryPage = () => {
    const { data, refetch } = useCategories();

    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
    const [openModalConfirmDelete, setOpenModalConfirmDelete] =
        useState<boolean>(false);
    const [categoryIdToDelete, setCategoryIdToDelete] = useState<
        string | undefined
    >(undefined);

    const form = useForm<CategoryForm>({
        defaultValues: {
            name: '',
            description: '',
            slug: '',
            icon: '',
        },
    });
    const { handleSubmit, register, formState } = form;

    const onSubmit = async (data: CategoryForm) => {
        try {
            const newCategory = await CategoryService.create(data);

            await refetch();
            setOpenModalCreate(false);
            form.reset();

            toast.success('Thêm danh mục thành công');
        } catch (error) {
            console.error(error);
            toast.error('Thêm danh mục thất bại');
        }
    };

    const handleDelete = async (categoryId: string) => {
        try {
            toast.promise(CategoryService.delete(categoryId), {
                loading: 'Đang xoá danh mục...',
                success: 'Xoá danh mục thành công',
                error: 'Xoá danh mục thất bại',
            });

            await refetch();
            setOpenModalConfirmDelete(false);
            setCategoryIdToDelete(undefined);
        } catch (error) {
            console.error(error);
            toast.error('Xoá danh mục thất bại');
        }
    };

    return (
        <>
            <Button
                variant="primary"
                size={'sm'}
                disabled={form.formState.isSubmitting}
                onClick={() => setOpenModalCreate(true)}
            >
                Tạo danh mục
            </Button>

            <Table className="mt-2">
                <TableHeader>
                    <TableRow>
                        <TableHead>Icon</TableHead>
                        <TableHead>Tên</TableHead>
                        <TableHead>Mô tả</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>Hành động</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data?.map((category: any) => {
                        const Icon = IconsArray.find(
                            (icon) => icon.name === category.icon
                        )?.icon;

                        return (
                            <TableRow key={category._id}>
                                <TableCell>
                                    {Icon && <Icon className="h-6 w-6" />}
                                </TableCell>
                                <TableCell>{category.name}</TableCell>
                                <TableCell>{category.description}</TableCell>
                                <TableCell>{category.slug}</TableCell>
                                <TableCell>
                                    <Button
                                        variant={'warning'}
                                        size={'sm'}
                                        onClick={() => {
                                            setOpenModalConfirmDelete(
                                                (prev) => !prev
                                            );

                                            setCategoryIdToDelete(category._id);
                                        }}
                                    >
                                        <Icons.Delete className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>

            <Modal
                handleClose={() => setOpenModalCreate(false)}
                show={openModalCreate}
                title="Thêm danh mục"
            >
                <Form {...form}>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex min-w-[400px] max-w-screen flex-col gap-1 p-4"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên danh mục</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Tên danh mục"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mô tả</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Mô tả" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Slug</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Slug" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <label className="text-sm" htmlFor="icon">
                            Icon
                        </label>
                        <select
                            id="icon"
                            {...register('icon')}
                            className="w-full rounded border p-2"
                            defaultValue={''}
                        >
                            {IconsArray.map((icon) => (
                                <option
                                    className="text-sm"
                                    key={icon.name}
                                    value={icon.name}
                                >
                                    {icon.name}
                                </option>
                            ))}
                        </select>

                        <Button
                            className={'mt-2 w-full'}
                            type="submit"
                            variant={'primary'}
                            size={'sm'}
                            disabled={formState.isSubmitting}
                        >
                            Thêm
                        </Button>
                    </form>
                </Form>
            </Modal>

            <ConfirmModal
                cancelText="Huỷ"
                confirmText="Xoá"
                message="Bạn có chắc chắn muốn xoá danh mục này?"
                onClose={() => setOpenModalConfirmDelete(false)}
                onConfirm={() => {
                    if (categoryIdToDelete) {
                        handleDelete(categoryIdToDelete);
                        setCategoryIdToDelete(undefined);
                    }
                }}
                setShow={setOpenModalConfirmDelete}
                open={openModalConfirmDelete}
                title="Xoá danh mục"
            />
        </>
    );
};

export default AdminMarketCategoryPage;
