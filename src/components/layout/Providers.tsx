'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { FunctionComponent, ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import {
    AppProvider,
    ChatProvider,
    SocialProvider,
    SocketProvider,
} from '@/context';

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
                        <SocialProvider>
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
                        </SocialProvider>
                    </AppProvider>
                </SocketProvider>
            </SessionProvider>
        </>
    );
};

export default Providers;
