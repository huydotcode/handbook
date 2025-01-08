'use client';
import { ReadMoreParagraph } from '@/components/shared';
import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';

interface Props {
    group: IGroup;
}

interface FormValues {
    name: string;
    description: string;
    avatar: string;
}

const Infomation: React.FC<Props> = ({ group }) => {
    const form = useForm<FormValues>();

    return (
        <>
            <div className="relative h-fit min-w-[300px] max-w-[40%] rounded-xl bg-secondary-1 px-4 py-2 shadow-md dark:bg-dark-secondary-1 xl:min-w-[200px] xl:max-w-[35%] lg:max-w-none">
                <div className="p-2">
                    <h5 className="text-sm font-bold">Mô tả nhóm</h5>
                    <ReadMoreParagraph
                        className="text-xs"
                        text={group.description}
                        maxCharCount={200}
                    />
                </div>

                <div className="p-2">
                    <h5 className="text-sm font-bold">Thành viên</h5>
                    <p className="text-xs">{group.members.length} thành viên</p>
                </div>

                <div className="p-2">
                    <h5 className="text-sm font-bold">Loại nhóm</h5>
                    <p className="text-xs">
                        {group.type == 'public' ? 'Công khai' : 'Riêng tư'}
                    </p>
                </div>

                <div className="p-2">
                    <h5 className="text-sm font-bold">Tham gia</h5>
                    <p className="text-xs">
                        {new Date(group.createdAt).toLocaleDateString()}
                    </p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        {/*<Button*/}
                        {/*    className="w-full"*/}
                        {/*    variant="primary"*/}
                        {/*    size={'sm'}*/}
                        {/*>*/}
                        {/*    Chỉnh sửa*/}
                        {/*</Button>*/}
                    </DialogTrigger>

                    <DialogContent className={'p-0'}>
                        <DialogHeader>
                            <DialogTitle>Chỉnh sửa thông tin nhóm</DialogTitle>
                        </DialogHeader>

                        <Form {...form}>
                            <form>
                                <FormField
                                    control={form.control}
                                    name={'name'}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tên nhóm</FormLabel>
                                            <FormControl>
                                                <Input
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
                                    name={'description'}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mô tả</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Mô tả"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={'avatar'}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Ảnh đại diện</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type={'file'}
                                                    placeholder="Ảnh đại diện"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
};
export default Infomation;
