'use client';
import { FunctionComponent, ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';

import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { SocketProvider } from '@/context/SocketContext';
import ChatProvider from '@/context/ChatContext';
import { AppProvider } from '@/context/AppContext';

const queryClient = new QueryClient();

interface ProvidersProps {
    children: ReactNode;
}

const Providers: FunctionComponent<ProvidersProps> = ({ children }) => {
    return (
        <>
            <SessionProvider>
                <SocketProvider>
                    <AppProvider>
                        <ChatProvider>
                            <QueryClientProvider client={queryClient}>
                                <ThemeProvider
                                    attribute="class"
                                    defaultTheme="system"
                                    enableSystem
                                    disableTransitionOnChange
                                >
                                    <Toaster
                                        position="bottom-center"
                                        reverseOrder={false}
                                    />
                                    {children}
                                </ThemeProvider>
                            </QueryClientProvider>
                        </ChatProvider>
                    </AppProvider>
                </SocketProvider>
            </SessionProvider>
        </>
    );
};

export default Providers;
