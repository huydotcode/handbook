'use client';
import React from 'react';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/Form';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { IconsArray } from '@/components/ui/Icons';
import { createCategory, getCategories } from '@/lib/actions/category.action';
import { getCategoriesKey } from '@/lib/queryKey';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface CategoryForm {
    name: string;
    description: string;
    slug: string;
    icon: string;
}

const CategoryPage: React.FC = () => {
    const { data, refetch } = useQuery({
        queryKey: getCategoriesKey(),
        queryFn: async () => {
            return await getCategories();
        },
    });

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
            const newCategory = await createCategory(data);

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

            <Form {...form}>
                <form
                    className={
                        'mx-auto my-2 max-w-[500px] rounded-xl border p-4'
                    }
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <h1 className="text-xl font-bold">Create Category</h1>

                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Name" {...field} />
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
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Description"
                                        {...field}
                                    />
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

                    <FormField
                        control={form.control}
                        name="icon"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Icon</FormLabel>
                                <FormControl>
                                    <Input placeholder="Icon" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        className={'mx-auto mt-2'}
                        type="submit"
                        disabled={formState.isSubmitting}
                    >
                        Submit
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default CategoryPage;
