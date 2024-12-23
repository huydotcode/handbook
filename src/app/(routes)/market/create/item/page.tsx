'use client';
import {
    Form,
    FormButton,
    FormError,
    FormGroup,
    FormInput,
    FormLabel,
    FormSelect,
    FormTextArea,
    FormTitle,
} from '@/components/ui/Form';
import { createItemValidation, CreateItemValidation } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import ItemService from '@/lib/services/item.service';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { CategoryService } from '@/lib/services';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import FileUploader from '@/components/shared/FileUploader';
import { Loading } from '@/components/ui';
import { uploadImagesWithFiles } from '@/lib/uploadImage';

const CreateItemPage = () => {
    const { data: session } = useSession();
    const router = useRouter();

    const { watch, handleSubmit, register, formState, getValues, setValue } =
        useForm<CreateItemValidation>({
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

    const files = getValues('images') || ([] as File[]);

    const { errors } = formState;

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            return await CategoryService.getCategories();
        },
    });

    const onSubmit = async (data: CreateItemValidation) => {
        router.push('/market');

        try {
            let images = await uploadImagesWithFiles({
                files,
            });

            const newItem = (await ItemService.createItem({
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
            console.log(error);
        }
    };

    const handleChange = (filesChange: any) => {
        setValue('images', filesChange);
    };

    watch('images');

    return (
        <>
            <div className="mx-auto mt-2 h-full w-[600px] max-w-full pt-4">
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <FormTitle>Tạo sản phẩm</FormTitle>

                    <FileUploader
                        className={'mb-2'}
                        handleChange={handleChange}
                    />

                    <div
                        className={
                            'flex w-full items-center justify-between gap-2 md:flex-col'
                        }
                    >
                        <FormGroup>
                            <FormLabel>Tên</FormLabel>
                            <FormInput
                                placeholder="Tên"
                                {...register('name')}
                            />
                            <FormError>{errors.name?.message}</FormError>
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Giá</FormLabel>
                            <FormInput
                                placeholder="Giá"
                                {...register('price')}
                            />
                            <FormError>{errors.price?.message}</FormError>
                        </FormGroup>
                    </div>
                    <FormGroup>
                        <FormLabel>Mô tả</FormLabel>
                        <FormTextArea
                            placeholder="Mô tả"
                            {...register('description')}
                        />
                        <FormError>{errors.description?.message}</FormError>
                    </FormGroup>
                    <div
                        className={
                            'flex w-full items-center justify-between gap-2 md:flex-col'
                        }
                    >
                        <FormGroup>
                            <FormLabel>Danh mục</FormLabel>
                            <FormSelect
                                placeholder="Danh mục"
                                {...register('category')}
                            >
                                <option value="">Chọn danh mục</option>
                                {categories?.map((category: ICategory) => (
                                    <option
                                        key={category._id}
                                        value={category._id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </FormSelect>
                            <FormError>{errors.category?.message}</FormError>
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Địa điểm</FormLabel>
                            <FormInput
                                placeholder="Địa điểm"
                                {...register('location')}
                            />
                            <FormError>{errors.location?.message}</FormError>
                        </FormGroup>
                    </div>
                    <FormButton
                        disabled={formState.isSubmitting}
                        type={'submit'}
                    >
                        Tạo sản phẩm
                    </FormButton>
                </Form>
            </div>

            {formState.isSubmitting && (
                <Loading fullScreen={true} title={'Đang tải mặt hàng'} />
            )}
        </>
    );
};

export default CreateItemPage;
