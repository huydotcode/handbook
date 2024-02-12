import { Button, Icons } from '@/components/ui';
import React from 'react';

interface Props {
    path: string;
    title: string;
    data?: any[];
    count: number;
    ItemComponent?: React.FC<any>;
    hasMore?: boolean;
}

const InfoGroup: React.FC<Props> = ({
    path,
    title,
    count,
    data,
    ItemComponent,
    hasMore = true,
}) => {
    return (
        <div className="max-h-[200px] max-w-[300px] rounded-xl bg-white p-4 shadow-xl dark:bg-dark-secondary-1">
            <div className="flex items-center justify-between">
                <h5>
                    {title}: {count}
                </h5>

                {hasMore && (
                    <Button href={path || '/admin'} variant={'text'}>
                        Chi tiết
                        <Icons.ArrowRight />
                    </Button>
                )}
            </div>
            <div className="mt-2 flex items-center">
                {ItemComponent &&
                    data &&
                    data.map((item: any) => {
                        return <ItemComponent data={item} key={item._id} />;
                    })}

                {data && count - data.length > 0 && (
                    <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full">
                        <span className="text-center">
                            +{count - data.length}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};
export default InfoGroup;
