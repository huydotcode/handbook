import Image from 'next/image';
import React from 'react';

interface Props {
    group: IGroup;
}

const Header: React.FC<Props> = ({ group }) => {
    return (
        <header className="w-full rounded-b-xl bg-white pb-2 dark:bg-dark-secondary-1">
            <div
                className="relative h-[40vh] min-h-[300px] w-full overflow-hidden rounded-b-xl bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url("${group.coverPhoto}`,
                }}
            />

            <div className="flex items-center justify-between border-b lg:px-2">
                <div className="flex items-center">
                    <div className="relative top-[-30px] mr-4 h-[164px] w-[164px] overflow-hidden rounded-full border-8 object-cover dark:border-dark-secondary-2 md:h-[120px] md:w-[120px]">
                        <Image
                            className="rounded-full"
                            src={group?.avatar || ''}
                            alt={group?.name || ''}
                            fill
                        />
                    </div>
                    <div>
                        <h5 className="text-2xl font-black md:text-lg">
                            {group?.name}
                        </h5>
                        <span className="text-sm">
                            Nhóm{' '}
                            {group.type == 'public' ? 'công khai' : 'riêng tư'}{' '}
                            - {group?.members.length} thành viên
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex w-[600px] max-w-screen items-center px-2 pt-2"></div>
        </header>
    );
};
export default Header;
