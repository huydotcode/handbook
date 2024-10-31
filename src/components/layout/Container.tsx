import React from 'react';

interface Props {
    className?: string;
    children: React.ReactNode;
}

const Container: React.FC<Props> = ({ className, children }) => {
    return (
        <div className="ml-[300px] mt-[56px] h-screen md:ml-0">{children}</div>
    );
};

export default Container;
