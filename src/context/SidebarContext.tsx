import { createContext, useContext } from 'react';

interface SidebarCollapseContextProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (value: boolean) => void;
}

export const SidebarCollapseContext = createContext<
    SidebarCollapseContextProps | undefined
>(undefined);

export const useSidebarCollapse = () => {
    const context = useContext(SidebarCollapseContext);
    if (!context) {
        throw new Error('useSidebar must be used within SidebarProvider');
    }
    return context;
};
