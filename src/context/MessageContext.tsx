'use client';
import React, { useContext } from 'react';

interface Props {
    children: React.ReactNode;
}

interface IMessageContext {}

const MessageContext = React.createContext<IMessageContext>(
    {} as IMessageContext
);

export const useChat = () => {
    return useContext(MessageContext) as IMessageContext;
};

const MessageProvider: React.FC<Props> = ({ children }) => {
    return (
        <MessageContext.Provider value={{}}>{children}</MessageContext.Provider>
    );
};
export default MessageProvider;
