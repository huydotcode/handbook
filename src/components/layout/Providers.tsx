'use client';
import { AppProvider, SocialProvider, SocketProvider } from '@/context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { FunctionComponent, ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

interface ProvidersProps {
    children: ReactNode;
}

const queryClient = new QueryClient();

const Providers: FunctionComponent<ProvidersProps> = ({ children }) => {
    return (
        <SessionProvider>
            <QueryClientProvider client={queryClient}>
                <SocketProvider>
                    <SocialProvider>
                        <AppProvider>
                            <ThemeProvider
                                attribute="class"
                                defaultTheme="system"
                                enableSystem
                            >
                                <Toaster
                                    position="bottom-left"
                                    reverseOrder={false}
                                />
                                {children}
                            </ThemeProvider>
                        </AppProvider>
                    </SocialProvider>
                </SocketProvider>
            </QueryClientProvider>
        </SessionProvider>
    );
};

export default Providers;
