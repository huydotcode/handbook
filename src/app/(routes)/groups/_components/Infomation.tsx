import React from 'react';

interface Props {
    group: IGroup;
}

const Infomation: React.FC<Props> = ({ group }) => {
    return (
        <div className="relative h-fit max-w-[500px] rounded-xl bg-secondary-1 px-4 py-2 shadow-md dark:bg-dark-secondary-1">
            <div>
                <h5 className="font-bold">Mô tả nhóm</h5>
                <p className="text-sm">{group.description}</p>
            </div>

            <div>
                <h5 className="font-bold">Thành viên</h5>
                <p className="text-sm">{group.members.length} thành viên</p>
            </div>

            <div>
                <h5 className="font-bold">Loại nhóm</h5>
                <p className="text-sm">
                    {group.type == 'public' ? 'Công khai' : 'Riêng tư'}
                </p>
            </div>

            <div>
                <h5 className="font-bold">Tham gia</h5>
                <p className="text-sm">
                    {new Date(group.createdAt).toLocaleDateString()}
                </p>
            </div>
        </div>
    );
};
export default Infomation;
