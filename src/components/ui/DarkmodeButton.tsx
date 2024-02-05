'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const DarkmodeButton = () => {
    const { systemTheme, theme, setTheme } = useTheme();
    const currentTheme = theme === 'system' ? systemTheme : theme;

    const [render, setRender] = useState<boolean>(false);

    useEffect(() => {
        setRender(true);
    }, []);

    return (
        <>
            {render && (
                <label className="ui-switch">
                    <input
                        type="checkbox"
                        checked={currentTheme == 'dark'}
                        onChange={(e) => {
                            const checked: boolean = e.target.checked;
                            const theme: string = checked ? 'dark' : 'light';
                            setTheme(theme);
                        }}
                    />
                    <div className="slider">
                        <div className="circle"></div>
                    </div>
                </label>
            )}
        </>
    );
};

export default DarkmodeButton;
