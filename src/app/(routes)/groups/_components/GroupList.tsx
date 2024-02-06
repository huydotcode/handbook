'use client';
import { useApp } from '@/context';
import React, { useEffect } from 'react';
import GroupItem from './GroupItem';

interface Props {}

const GroupList: React.FC<Props> = ({}) => {
    const { groups } = useApp();

    // log groups
    useEffect(() => {
        console.log(groups);
    }, [groups]);

    return (
        <div className="mt-2">
            <h5 className="font-bold">Nhóm bạn đã tham gia</h5>

            <div>
                {groups &&
                    groups.map((group) => {
                        return <GroupItem key={group._id} data={group} />;
                    })}
            </div>
        </div>
    );
};
export default GroupList;
