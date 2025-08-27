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
import { useQueryInvalidation } from '@/hooks/useQueryInvalidation';
import ItemService from '@/lib/services/item.service';
import { uploadImagesWithFiles } from '@/lib/uploadImage';
import { createItemValidation, CreateItemValidation } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const CreateItemPage = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const { invalidateItems } = useQueryInvalidation();

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
        try {
            const images = await uploadImagesWithFiles({
                files,
            });

            await ItemService.create({
                name: data.name,
                seller: session?.user.id || '',
                description: data.description,
                price: +data.price.replace(/\D/g, ''), // Chuyển đổi giá thành số
                imagesIds: images.map((image) => image._id),
                location: data.location,
                category: data.category,
                status: 'active',
            });

            invalidateItems();

            router.push('/market');

            toast.success('Tạo sản phẩm thành công');
        } catch (error) {
            console.log(error);
            toast.error('Có lỗi xảy ra');
        }
    };

    const handleChange = (filesChange: any) => {
        setValue('images', filesChange);
    };

    watch('images');

    return (
        <>
            <div className="mx-auto w-[550px] max-w-screen lg:ml-0 lg:w-full">
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
                                    <FormItem className={'flex-1 md:w-full'}>
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
                                    <FormItem className="md:w-full">
                                        <FormLabel>Giá</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="w-full bg-primary-1 dark:bg-dark-primary-1"
                                                placeholder="Giá"
                                                value={
                                                    field.value
                                                        ? Number(
                                                              field.value
                                                          ).toLocaleString(
                                                              'vi-VN'
                                                          )
                                                        : ''
                                                }
                                                onChange={(e) => {
                                                    const rawValue =
                                                        e.target.value.replace(
                                                            /\D/g,
                                                            ''
                                                        ); // bỏ tất cả ký tự không phải số
                                                    field.onChange(rawValue); // lưu giá trị thô vào form
                                                }}
                                                onBlur={field.onBlur}
                                                name={field.name}
                                                ref={field.ref}
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
                                <FormItem className={'mt-2 w-full'}>
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
                                    <FormItem className="md:w-full">
                                        <FormLabel>Danh mục</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger
                                                    className={
                                                        'w-[200px] bg-primary-1 dark:bg-dark-primary-1 md:w-full'
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
                                    <FormItem className={'flex-1 md:w-full'}>
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
