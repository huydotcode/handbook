'use client';
import { ReadMoreParagraph } from '@/components/shared';
import { Button } from '@/components/ui';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';

interface Props {
    group: IGroup;
}

const Infomation: React.FC<Props> = ({ group }) => {
    const [openModal, setOpenModal] = useState<boolean>(false);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    return (
        <>
            <div className="relative h-fit min-w-[200px] max-w-[30%] rounded-xl bg-secondary-1 py-2 pl-4 pr-8 shadow-md dark:bg-dark-secondary-1 md:max-w-none">
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

                <Button
                    className="w-full"
                    variant="primary"
                    onClick={handleOpenModal}
                >
                    Chỉnh sửa
                </Button>
            </div>
        </>
    );
};
export default Infomation;
