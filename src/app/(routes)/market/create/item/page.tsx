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
import { useState } from 'react';
import FileUploader from '@/components/shared/FileUploader';

const CreateItemPage = () => {
    const { data: session } = useSession();

    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<CreateItemValidation>({
        resolver: zodResolver(createItemValidation),
    });

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            return await CategoryService.getCategories();
        },
    });

    const onSubmit = async (data: CreateItemValidation) => {
        try {
            const newItem = await ItemService.createItem({
                name: data.name,
                seller: session?.user?.id || '',
                description: data.description,
                price: +data.price,
                image: '',
                location: data.location,
                category: data.category,
                status: 'active',
                images: [],
            });

            console.log({
                newItem,
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <div className="w-[600px] max-w-full">
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <FormTitle>Tạo sản phẩm</FormTitle>

                    <FileUploader className={'mb-2'} />

                    <FormGroup>
                        <FormLabel>Tên</FormLabel>
                        <FormInput placeholder="Tên" {...register('name')} />
                        <FormError>{errors.name?.message}</FormError>
                    </FormGroup>

                    {/*Number validate*/}
                    <FormGroup>
                        <FormLabel>Giá</FormLabel>
                        <FormInput placeholder="Giá" {...register('price')} />
                        <FormError>{errors.price?.message}</FormError>
                    </FormGroup>

                    <FormGroup>
                        <FormLabel>Mô tả</FormLabel>
                        <FormTextArea
                            placeholder="Mô tả"
                            {...register('description')}
                        />
                        <FormError>{errors.description?.message}</FormError>
                    </FormGroup>

                    <FormGroup>
                        <FormLabel>Danh mục</FormLabel>
                        <FormSelect
                            placeholder="Danh mục"
                            {...register('category')}
                        >
                            <option value="">Chọn danh mục</option>
                            {categories?.map((category: ICategory) => (
                                <option key={category._id} value={category._id}>
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

                    <FormButton>Tạo sản phẩm</FormButton>
                </Form>
            </div>
        </>
    );
};

export default CreateItemPage;
