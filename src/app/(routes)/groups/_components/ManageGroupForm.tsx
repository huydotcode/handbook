'use client';
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
import GroupService from '@/lib/services/group.service';
import { createGroupValidation } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const INPUT_CLASSNAME =
    'my-1 w-full rounded-md border bg-primary-1 p-2 dark:bg-dark-primary-1';

interface ICreateGroup {
    name: string;
    description: string;
    type: string;
}

interface Props {
    group: IGroup;
}

const ManageGroupForm = ({ group }: Props) => {
    const path = usePathname();
    const form = useForm<ICreateGroup>({
        defaultValues: {
            type: group.type,
            description: group.description,
            name: group.name,
        },
        resolver: zodResolver(createGroupValidation),
    });
    const {
        handleSubmit,
        register,
        formState: { isSubmitting, errors },
    } = form;

    const onSubmit = async (data: ICreateGroup) => {
        if (isSubmitting) return;

        try {
            await GroupService.update({
                groupId: group._id,
                name: data.name,
                description: data.description,
                type: data.type,
                path,
            });

            toast.success('Cập nhật nhóm thành công!');
        } catch (error) {
            toast.error('Có lỗi khi cập nhật nhóm!');
        }
    };

    return (
        <div className="mx-auto w-[500px] max-w-screen rounded-xl bg-secondary-1 p-6 dark:bg-dark-secondary-2">
            <Form {...form}>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="mt-4 flex flex-col space-y-4"
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên nhóm</FormLabel>
                                <FormControl>
                                    <Input
                                        className={INPUT_CLASSNAME}
                                        placeholder="Tên nhóm"
                                        {...field}
                                    />
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
                                <FormLabel>Mô tả</FormLabel>
                                <FormControl>
                                    <Input
                                        className={INPUT_CLASSNAME}
                                        placeholder="Mô tả nhóm"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Loại nhóm</FormLabel>
                                <FormControl>
                                    <select
                                        {...field}
                                        className={INPUT_CLASSNAME}
                                    >
                                        <option value="public">
                                            Công khai
                                        </option>
                                        <option value="private">
                                            Riêng tư
                                        </option>
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        className="mt-2"
                        type="submit"
                        variant="primary"
                        disabled={isSubmitting}
                        size={'sm'}
                    >
                        {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default ManageGroupForm;
