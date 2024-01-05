'use client';
import { createContext, useContext } from 'react';

type AppContextType = {};

const AppContext = createContext<AppContextType | any>({});

export const useSocket = () => {
    return useContext(AppContext) as AppContextType;
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const values = {};
    return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};
