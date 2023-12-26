import React from 'react';

interface ProfilePageProps {
    params: {
        userId: string;
    };
}

const Messages: React.FC<ProfilePageProps> = async ({ params }) => {
    return <>Chat with {params.userId}</>;
};

export default Messages;
