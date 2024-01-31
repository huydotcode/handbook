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
                <div className="mx-auto sm:min-w-0 md:min-w-[300px] lg:min-w-[400px]">
                    {Center}
                </div>
            )}

            {Right && <>{Right}</>}
        </>
    );
};
export default IndexLayout;
