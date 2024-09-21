'use client';
import {
    AppProvider,
    ChatProvider,
    SocialProvider,
    SocketProvider,
} from '@/context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { FunctionComponent, ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient();

interface ProvidersProps {
    children: ReactNode;
}

const Providers: FunctionComponent<ProvidersProps> = ({ children }) => {
    return (
        <SessionProvider>
            <SocketProvider>
                <QueryClientProvider client={queryClient}>
                    <SocialProvider>
                        <AppProvider>
                            <ChatProvider>
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
                            </ChatProvider>
                        </AppProvider>
                    </SocialProvider>
                </QueryClientProvider>
            </SocketProvider>
        </SessionProvider>
    );
};

export default Providers;
