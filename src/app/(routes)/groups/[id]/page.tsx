import React from 'react';

interface Props {
    params: {
        id: string;
    };
}

const page: React.FC<Props> = ({ params: { id: groupId } }) => {
    return (
        <div>
            <h1>Group {groupId}</h1>
        </div>
    );
};
export default page;
