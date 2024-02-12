'use client';
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';

interface Props {
    className?: string;
}

const DarkmodeButton: React.FC<Props> = ({ className }) => {
    const { systemTheme, theme, setTheme } = useTheme();
    const currentTheme = theme === 'system' ? systemTheme : theme;

    const [render, setRender] = useState<boolean>(false);

    useEffect(() => {
        setRender(true);
    }, []);

    return (
        <>
            {render && (
                <div className={className}>
                    <label className="ui-switch">
                        <input
                            type="checkbox"
                            checked={currentTheme == 'dark'}
                            onChange={(e) => {
                                const checked: boolean = e.target.checked;
                                const theme: string = checked
                                    ? 'dark'
                                    : 'light';
                                setTheme(theme);
                            }}
                        />
                        <div className="slider">
                            <div className="circle"></div>
                        </div>
                    </label>
                </div>
            )}
        </>
    );
};

export default DarkmodeButton;
