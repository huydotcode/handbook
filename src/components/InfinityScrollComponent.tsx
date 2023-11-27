import React from 'react';

interface Props {
    children: React.ReactNode;
}

const InfinityScrollComponent: React.FC<Props> = ({ children }) => {
    return <>{children}</>;
};
export default InfinityScrollComponent;
