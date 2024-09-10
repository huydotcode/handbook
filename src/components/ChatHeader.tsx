'use client';
import { Avatar, Button } from '@/components/ui';
import React from 'react';

interface Props {
    setOpenChat: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatHeader: React.FC<Props> = ({ setOpenChat }) => {
    return (
        <div className="flex h-16 items-center justify-between border-b p-4 dark:border-dark-secondary-2">
            <div className="flex items-center">
                <Avatar
                    imgSrc={'/assets/img/Google_Gemini_logo.svg.png'}
                    alt="Gemini"
                    className="h-10 w-10 object-contain"
                />

                <div className="flex flex-col">
                    <h3 className="text-md ml-2 font-bold">
                        Trò chuyện cùng Gemini
                    </h3>
                </div>
            </div>

            <Button onClick={() => setOpenChat(false)}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </Button>
        </div>
    );
};
export default ChatHeader;
