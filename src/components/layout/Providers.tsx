'use client';
import { FunctionComponent, ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';

import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { SocketProvider } from '@/context/SocketContext';
import ChatProvider from '@/context/ChatContext';

const queryClient = new QueryClient();

interface ProvidersProps {
    children: ReactNode;
}

const Providers: FunctionComponent<ProvidersProps> = ({ children }) => {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider attribute="class">
                    <SessionProvider>
                        <SocketProvider>
                            <Toaster
                                position="bottom-center"
                                reverseOrder={false}
                            />
                            {children}
                        </SocketProvider>
                    </SessionProvider>
                </ThemeProvider>
            </QueryClientProvider>
        </>
    );
};

export default Providers;
