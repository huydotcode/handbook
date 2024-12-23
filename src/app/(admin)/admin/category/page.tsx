'use client';
import React from 'react';
import {
    Form,
    FormButton,
    FormGroup,
    FormInput,
    FormLabel,
    FormSelect,
    FormTitle,
} from '@/components/ui/Form';
import { useForm } from 'react-hook-form';
import { CategoryService } from '@/lib/services';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { IconsArray } from '@/components/ui/Icons';

/*
    name: string;
    description: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
* */
interface CategoryForm {
    name: string;
    description: string;
    slug: string;
    icon: string;
}

const CategoryPage: React.FC = () => {
    const { data, refetch } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            return await CategoryService.getCategories();
        },
    });

    const { handleSubmit, register, formState } = useForm<CategoryForm>({
        defaultValues: {
            name: '',
            description: '',
            slug: '',
            icon: '',
        },
    });

    const onSubmit = async (data: CategoryForm) => {
        console.log('onSubmit', data);
        try {
            const newCategory = await CategoryService.createCategory({
                name: data.name,
                description: data.description,
                slug: data.slug,
                icon: data.icon,
                path: '/admin/category',
            });

            await refetch();

            toast.success('Category created successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to create category');
        }
    };

    return (
        <div className={'h-screen w-full bg-secondary-1'}>
            <h1 className="text-xl font-bold">Categories</h1>
            <div className="flex items-center p-2">
                {data?.map((category: any) => {
                    const Icon = IconsArray.find(
                        (icon) => icon.name === category.icon
                    )?.icon;

                    return (
                        <div
                            className={
                                'flex items-center rounded border border-gray-300 p-2'
                            }
                            key={category._id}
                        >
                            {Icon && <Icon className="mr-2" />}
                            <span>{category.name}</span>
                        </div>
                    );
                })}
            </div>

            <Form
                className={'mx-auto my-2 max-w-[500px] rounded-xl border p-4'}
                onSubmit={handleSubmit(onSubmit)}
            >
                <FormTitle>Create Category</FormTitle>

                <FormGroup>
                    <FormLabel>Name</FormLabel>
                    <FormInput
                        {...register('name', { required: 'Name is required' })}
                    />
                </FormGroup>

                <FormGroup>
                    <FormLabel>Description</FormLabel>
                    <FormInput
                        {...register('description', {
                            required: 'Description is required',
                        })}
                    />
                </FormGroup>

                <FormGroup>
                    <FormLabel>Slug</FormLabel>
                    <FormInput
                        {...register('slug', { required: 'Slug is required' })}
                    />
                </FormGroup>

                <FormGroup>
                    <FormLabel>Icon</FormLabel>
                    <FormSelect {...register('icon')}>
                        <option value="">Select Icon</option>
                        {IconsArray.sort((a, b) =>
                            a.name.localeCompare(b.name)
                        ).map((icon) => {
                            const Icon = icon.icon;

                            return (
                                <option key={icon.name} value={icon.name}>
                                    <Icon className="mr-2" />
                                    {icon.name}
                                </option>
                            );
                        })}
                    </FormSelect>
                </FormGroup>

                <FormButton
                    className={'mx-auto mt-2'}
                    type="submit"
                    disabled={formState.isSubmitting}
                >
                    Submit
                </FormButton>
            </Form>
        </div>
    );
};

export default CategoryPage;
