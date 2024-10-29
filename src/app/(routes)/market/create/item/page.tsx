'use client';
import { createItemValidation, CreateItemValidation } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const CreateItemPage = () => {
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<CreateItemValidation>({
        resolver: zodResolver(createItemValidation),
    });

    const handleCreateItem = (data: CreateItemValidation) => {
        console.log({ data });
    };

    return <></>;
};

export default CreateItemPage;
