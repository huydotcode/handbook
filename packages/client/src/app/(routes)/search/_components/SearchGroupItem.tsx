'use client';
import { Avatar } from '@/components/ui';
import { Button } from '@/components/ui/Button';

const SearchGroupItem = ({ data }: { data: IGroup }) => {
    return (
        <div className="flex items-center rounded-xl bg-secondary-1 px-2 py-1 shadow-sm">
            <Avatar
                userUrl={data._id}
                imgSrc={data.avatar.url}
                width={32}
                height={32}
            />

            <div className="flex flex-1 items-center justify-between">
                <div className="ml-2 flex flex-col gap-2">
                    <Button variant="text" href={`/groups/${data._id}`}>
                        {data.name}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SearchGroupItem;
