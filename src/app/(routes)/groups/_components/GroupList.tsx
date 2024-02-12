'use client';
import React, { useEffect } from 'react';
import GroupItem from './GroupItem';

interface Props {
    data: IGroup[];
}

const GroupList: React.FC<Props> = ({ data: groups }) => {
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
