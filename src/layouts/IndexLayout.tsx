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
                <div className="mx-auto w-[600px] max-w-[100vw] lg:w-[500px]">
                    {Center}
                </div>
            )}

            {Right && <>{Right}</>}
        </>
    );
};
export default IndexLayout;
