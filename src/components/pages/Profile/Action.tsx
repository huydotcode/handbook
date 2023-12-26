'use client';
import { Button } from '@/components';
import { addFriend } from '@/lib/actions/profile.action';
import React, { FormEventHandler } from 'react';

interface Props {
    userId: string;
}

const Action: React.FC<Props> = ({ userId }) => {
    const handleAddFriend: FormEventHandler = async (e) => {
        e.preventDefault();

        await addFriend({
            userId,
        });
    };

    return (
        <form onSubmit={handleAddFriend}>
            <Button variant={'event'} size={'medium'}>
                Thêm bạn bè
            </Button>
        </form>
    );
};
export default Action;
