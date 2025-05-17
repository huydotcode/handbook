'use client';
import FileUploader from '@/components/shared/FileUploader';
import { Loading } from '@/components/ui';
import { Button } from '@/components/ui/Button';
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
import { getCategories } from '@/lib/actions/category.action';
import { createItem } from '@/lib/actions/item.action';
import { getCategoriesKey } from '@/lib/queryKey';
import { uploadImagesWithFiles } from '@/lib/uploadImage';
import { createItemValidation, CreateItemValidation } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

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

    const { watch, handleSubmit, formState, getValues, setValue } = form;

    const files = getValues('images') || ([] as File[]);

    const { data: categories } = useCategories();
    const { data: locations } = useLocations();

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
            <div className="mx-auto mt-2 h-full w-[600px] max-w-full pt-4">
                <Form {...form}>
                    <form
                        className="rounded-xl bg-secondary-1 p-6 dark:bg-dark-secondary-1"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <h1
                            className={
                                'mb-4 text-center text-2xl font-semibold text-primary-1 dark:text-dark-primary-1'
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
                                            onValueChange={field.onChange}
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
                                                    (category: ICategory) => (
                                                        <SelectItem
                                                            key={category._id}
                                                            value={category._id}
                                                        >
                                                            {category.name}
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
                                            onValueChange={field.onChange}
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
                                                    (location: ILocation) => (
                                                        <SelectItem
                                                            key={location._id}
                                                            value={location._id}
                                                        >
                                                            {location.name}
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

                        <div className={'mt-4 flex w-full justify-center'}>
                            <Button
                                variant={'primary'}
                                disabled={formState.isSubmitting}
                                type={'submit'}
                            >
                                Tạo sản phẩm
                            </Button>
                        </div>
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
