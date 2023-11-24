'use client';
import { Menu } from '@mui/material';
import { useTheme } from 'next-themes';
import React, { FC, useState } from 'react';

interface Props {
    open: boolean;
    anchorEl: HTMLElement | null;
    children: React.ReactNode;
    handleClose: () => void;
    positionArrow?: number;
}

export const usePopover = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleShow = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return { open, anchorEl, handleShow, handleClose };
};

const Popover: FC<Props> = ({
    anchorEl,
    open,
    handleClose,
    children,
    positionArrow,
}) => {
    const { theme } = useTheme();

    const PaperProps = {
        elevation: 0,
        sx: {
            backgroundColor: theme === 'light' ? 'white' : '#242526',
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            borderRadius: 3,
            padding: 1.5,
            '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
            },
            '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: positionArrow || 16,
                width: 10,
                height: 10,
                bgcolor: theme === 'light' ? 'background.paper' : '#242526',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
            },
        },
    };

    return (
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={PaperProps}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            {children}
        </Menu>
    );
};
export default Popover;
