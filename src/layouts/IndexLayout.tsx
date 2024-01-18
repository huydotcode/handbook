import React from 'react';

interface Props {
    Left: React.ReactNode;
    Center: React.ReactNode;
    Right: React.ReactNode;
}

const IndexLayout: React.FC<Props> = ({ Center, Left, Right }) => {
    return (
        <>
            {Left && (
                <aside className="fixed top-[72px] left-0 transition-all duration-300 md:hidden h-[calc(100vh-72px)]">
                    {Left}
                </aside>
            )}

            {Center && (
                <div className="mx-auto sm:min-w-0 md:min-w-[300px] lg:min-w-[400px]">
                    {Center}
                </div>
            )}

            {Right && (
                <aside className="fixed top-[72px] right-0 h-[calc(100vh-72px)] md:hidden flex justify-end">
                    {Right}
                </aside>
            )}
        </>
    );
};
export default IndexLayout;
