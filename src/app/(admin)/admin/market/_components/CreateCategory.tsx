'use client';
import { Button } from '@/components/ui';
import { CategoryService } from '@/lib/services';
import { usePathname } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface Props {}

interface FormData {
    name: string;
    description: string;
    slug: string;
}

const CreateCategory: React.FC<Props> = () => {
    const { register, handleSubmit, reset } = useForm<FormData>();
    const path = usePathname();

    const onSubmit = async (data: FormData) => {
        const { name, description, slug } = data;

        try {
            const newCategory = await CategoryService.createCategory({
                description,
                name,
                slug,
                path,
            });
        } catch (error) {
            toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
        } finally {
            reset();
        }
    };

    return (
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <input className="my-2 flex-1 px-4 py-2" {...register('name')} />
            <input
                className="my-2 flex-1 px-4 py-2"
                {...register('description')}
            />
            <input className="my-2 flex-1 px-4 py-2" {...register('slug')} />
            <Button type="submit">Submit</Button>
        </form>
    );
};

export default CreateCategory;
