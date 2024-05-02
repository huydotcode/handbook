'use client';
import React from 'react';
import Message from './Message';

interface Props {
    data: IMessage[];
}

const MesssageList: React.FC<Props> = ({ data: messagesInRoom }) => {
    if (!messagesInRoom) return null;

    return (
        <div className="no-scrollbar flex h-full flex-col-reverse overflow-y-scroll">
            {messagesInRoom.map((msg) => (
                <Message
                    key={msg._id}
                    data={msg}
                    messagesInRoom={messagesInRoom}
                />
            ))}
        </div>
    );
};
export default MesssageList;
