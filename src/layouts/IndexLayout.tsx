import { Container } from '@mui/material';
import React from 'react';

interface Props {
    containerClassName?: string;
    Left?: React.ReactNode;
    Center?: React.ReactNode;
    Right?: React.ReactNode;
}

const IndexLayout: React.FC<Props> = ({ Center, Left, Right }) => {
    return (
        <>
            {Left && <>{Left}</>}

            {Center && (
                <div className="mx-auto lg:min-w-[400px] md:min-w-[300px] sm:min-w-0">
                    {Center}
                </div>
            )}

            {Right && <>{Right}</>}
        </>
    );
};
export default IndexLayout;
