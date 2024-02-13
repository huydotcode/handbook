'use client';
import React from 'react';
import Message from './Message';

interface Props {
    data: IMessage[];
}

const MesssageList: React.FC<Props> = ({ data: messagesInRoom }) => {
    return (
        <>
            {messagesInRoom.map((msg) => (
                <Message
                    key={msg._id}
                    data={msg}
                    messagesInRoom={messagesInRoom}
                />
            ))}
        </>
    );
};
export default MesssageList;
