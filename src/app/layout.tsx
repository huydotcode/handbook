import Providers from '@/components/layout/Providers';
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import '@/styles/globals.scss';

const roboto = Roboto({
    subsets: ['vietnamese'],
    weight: '400',
});

export const metadata: Metadata = {
    title: 'Handbook',
    description: 'Social website',
};

interface Props {
    children: React.ReactNode;
}

export default function RootLayout(props: Props) {
    return (
        <html lang="en" translate="no">
            <head>
                <link
                    rel="icon"
                    href="/assets/svg/logo.svg"
                    type="image/svg"
                    sizes="svg"
                />
            </head>
            <body className={roboto.className}>
                <Providers>{props.children}</Providers>
            </body>
        </html>
    );
}
