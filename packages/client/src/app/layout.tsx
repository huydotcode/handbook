import Providers from '@/components/layout/Providers';
import type { Metadata } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import '@/styles/globals.scss';
import React from 'react';

const font = Be_Vietnam_Pro({
    subsets: ['vietnamese'],
    weight: '400',
});

export const metadata: Metadata = {
    title: 'Handbook',
    description: 'Mạng xã hội Việt Nam',
};

interface Props {
    children: React.ReactNode;
}

export default function RootLayout(props: Props) {
    return (
        <html lang="vi" translate="no" suppressHydrationWarning>
            <head>
                <link
                    rel="icon"
                    href="/assets/img/logo.png"
                    type="image/svg"
                    sizes="svg"
                />
            </head>
            <body className={font.className}>
                <Providers>{props.children}</Providers>
            </body>
        </html>
    );
}
