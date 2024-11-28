import { InfinityPostComponent } from '@/components/post';
import { Button } from '@/components/ui';
import { getAuthSession } from '@/lib/auth';
import GroupService from '@/lib/services/group.service';
import React from 'react';
import { Sidebar } from './_components';
import { Container } from '@/components/layout';

interface Props {}

const GroupsPage: React.FC<Props> = async ({}) => {
    const session = await getAuthSession();
    if (!session) return null;

    const groups = (await GroupService.getGroups({
        userId: session.user.id,
    })) as IGroup[];

    return (
        <div>
            <Sidebar groups={groups} />
            <div className="ml-[360px] mt-[56px] min-h-screen bg-secondary-1">
                {groups.length > 0 ? (
                    <InfinityPostComponent
                        className="mt-4"
                        title="Hoạt động gần đây"
                        type="group"
                    />
                ) : (
                    <div className="mt-2 flex items-center justify-center">
                        <p className="mr-2 text-secondary-1">
                            Bạn chưa tham gia nhóm nào
                        </p>

                        <Button href="groups/explore" variant={'text'}>
                            Tìm nhóm
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
export default GroupsPage;
