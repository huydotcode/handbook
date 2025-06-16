'use client';
import { Loading, Modal } from '@/components/ui';
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useLocations } from '@/context/AppContext';
import { createLocation } from '@/lib/actions/admin/locaiton.action';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface Location {
    name: string;
    slug: string;
    type: string;
    nameWithType: string;
    code: string;
}

const AdminLocationsPage = () => {
    const { data: locations, isLoading, refetch } = useLocations();
    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
    const form = useForm<Location>({
        defaultValues: {
            name: '',
            slug: '',
            type: '',
            nameWithType: '',
            code: '',
        },
    });

    const { handleSubmit, register, formState, control } = form;

    const onSubmit = async (data: Location) => {
        try {
            await createLocation({
                name: data.name,
                slug: data.slug,
                type: data.type,
                nameWithType: data.nameWithType,
                code: data.code,
            });
            await refetch();
            setOpenModalCreate(false);
            form.reset();
        } catch (error) {
            console.error('Error creating location:', error);
            toast.error('Không thể tạo địa điểm. Vui lòng thử lại sau.');
        }
    };

    return (
        <div>
            <h1 className="mb-4 text-2xl font-bold">Quản lý địa điểm</h1>

            <Button
                variant="primary"
                size={'sm'}
                onClick={() => setOpenModalCreate(true)}
            >
                Tạo địa điểm
            </Button>

            {isLoading ? (
                <Loading fullScreen />
            ) : (
                <Table className="mt-2">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tên</TableHead>
                            <TableHead>Loại</TableHead>
                            <TableHead>Slug</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {locations?.map((location) => (
                            <TableRow key={location.nameWithType}>
                                <TableCell>{location.name}</TableCell>
                                <TableCell>{location.type}</TableCell>
                                <TableCell>{location.slug}</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            <Modal
                handleClose={() => setOpenModalCreate(false)}
                show={openModalCreate}
                title="Thêm danh mục"
            >
                <Form {...form}>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex min-w-[400px] max-w-screen flex-col gap-1 p-4"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên địa điểm</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Tên địa điểm"
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
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Loại địa điểm</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Loại địa điểm"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="nameWithType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên với loại</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Tên với loại"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mã địa điểm</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Mã địa điểm"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            className={'mt-2 w-full'}
                            type="submit"
                            variant={'primary'}
                            size={'sm'}
                            disabled={formState.isSubmitting}
                        >
                            Thêm
                        </Button>
                    </form>
                </Form>
            </Modal>
        </div>
    );
};

export default AdminLocationsPage;
