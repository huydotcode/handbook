'use client';
import FileUploader from '@/components/shared/FileUploader';
import { Loading } from '@/components/ui';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/Form';
import { getCategories } from '@/lib/actions/category.action';
import { uploadImagesWithFiles } from '@/lib/uploadImage';
import { createItemValidation, CreateItemValidation } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { createItem } from '@/lib/actions/item.action';
import { getCategoriesKey } from '@/lib/queryKey';
import { Input } from '@/components/ui/Input';
import React from 'react';
import { Button } from '@/components/ui/Button';

const CreateItemPage = () => {
    const { data: session } = useSession();
    const router = useRouter();

    const form = useForm<CreateItemValidation>({
        resolver: zodResolver(createItemValidation),
        defaultValues: {
            name: '',
            price: '',
            description: '',
            category: '',
            location: '',
            images: [],
        },
    });

    const { watch, handleSubmit, register, formState, getValues, setValue } =
        form;

    const files = getValues('images') || ([] as File[]);

    const { errors } = formState;

    const { data: categories } = useQuery({
        queryKey: getCategoriesKey(),
        queryFn: async () => {
            return await getCategories();
        },
    });

    const onSubmit = async (data: CreateItemValidation) => {
        router.push('/market');

        try {
            let images = await uploadImagesWithFiles({
                files,
            });

            const newItem = (await createItem({
                name: data.name,
                seller: session?.user.id || '',
                description: data.description,
                price: +data.price,
                images,
                location: data.location,
                category: data.category,
                status: 'active',
            })) as IItem;

            toast.success('Tạo sản phẩm thành công');
        } catch (error) {
            toast.error('Có lỗi xảy ra');
        }
    };

    const handleChange = (filesChange: any) => {
        setValue('images', filesChange);
    };

    watch('images');

    return (
        <>
            <div className="mx-auto mt-2 h-full w-[600px] max-w-full  pt-4">
                <Form {...form}>
                    <form
                        className="bg-secondary-1"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <h1
                            className={
                                'mb-4 text-center text-2xl font-semibold text-primary-1'
                            }
                        >
                            Tạo sản phẩm
                        </h1>

                        <FileUploader
                            className={'mb-2'}
                            handleChange={handleChange}
                        />

                        <div
                            className={
                                'flex w-full items-center justify-between gap-2 md:flex-col'
                            }
                        >
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tên</FormLabel>
                                        <FormControl>
                                            <Input
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
                                <FormItem>
                                    <FormLabel>Mô tả</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Mô tả" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div
                            className={
                                'flex w-full items-center justify-between gap-2 md:flex-col'
                            }
                        >
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Danh mục</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Danh mục"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Vị trí</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Vị trí"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button
                            disabled={formState.isSubmitting}
                            type={'submit'}
                        >
                            Tạo sản phẩm
                        </Button>
                    </form>
                </Form>
            </div>

            {formState.isSubmitting && (
                <Loading fullScreen={true} title={'Đang tải mặt hàng'} />
            )}
        </>
    );
};

export default CreateItemPage;
