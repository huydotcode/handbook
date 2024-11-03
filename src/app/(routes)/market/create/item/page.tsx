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
import { uploadImage } from '@/lib/upload';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const CreateItemPage = () => {
    const { data: session } = useSession();
    const router = useRouter();

    const { handleSubmit, register, formState } = useForm<CreateItemValidation>(
        {
            resolver: zodResolver(createItemValidation),
        }
    );

    const { errors } = formState;

    const [files, setFiles] = useState<File[]>([]);

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            return await CategoryService.getCategories();
        },
    });

    const onSubmit = async (data: CreateItemValidation) => {
        console.log('onSubmit');
        try {
            let images = [] as string[];

            if (files.length != 0) {
                const uploadPromises = files.map((file) => {
                    return new Promise<string>((resolve, reject) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = async () => {
                            try {
                                const base64 = reader.result as string;
                                const image = await uploadImage({
                                    image: base64,
                                });
                                resolve(image._id);
                            } catch (error) {
                                reject(error);
                            }
                        };
                        reader.onerror = (error) => reject(error);
                    });
                });

                images = await Promise.all(uploadPromises);
            } else {
                toast.error('Vui lòng chọn ảnh sản phẩm');
                return;
            }

            const newItem = await ItemService.createItem({
                name: data.name,
                seller: session?.user.id || '',
                description: data.description,
                price: +data.price,
                images,
                location: data.location,
                category: data.category,
                status: 'active',
            });

            toast.success('Tạo sản phẩm thành công');
            router.push('/market');
        } catch (error) {
            toast.error('Đã có lỗi xảy ra khi tạo sản phẩm');
        }
    };

    const handleChange = (files: File[]) => {
        setFiles(files);
    };

    return (
        <div className="mx-auto mt-24 w-[600px] max-w-full bg-secondary-1">
            <Form onSubmit={handleSubmit(onSubmit)}>
                <FormTitle>Tạo sản phẩm</FormTitle>

                <FileUploader className={'mb-2'} handleChange={handleChange} />

                <FormGroup>
                    <FormLabel>Tên</FormLabel>
                    <FormInput placeholder="Tên" {...register('name')} />
                    <FormError>{errors.name?.message}</FormError>
                </FormGroup>

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
    );
};

export default CreateItemPage;
