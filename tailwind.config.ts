/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            width: {
                '120': '30rem',
                '135': '33.75rem',
                '140': '35rem',
                '150': '36rem',
                container: 'var(--container-width)',
            },
            textColor: {
                'primary-1': 'var(--dark-primary-1)',
                'secondary-1': 'var(--secondary-text-1)',
                'dark-primary-1': 'var(--primary-1)',
                warning: 'var(--warning)',
            },
            colors: {
                'primary-1': 'var(--primary-1)',
                'primary-2': 'var(--primary-2-blue)',
                'primary-500': '#877EFF',
                'secondary-1': 'var(--secondary-1)',
                'secondary-2': 'var(--secondary-2)',
                'background-1': 'var(--background-1)',
                blue: 'var(--primary-2-blue)',
                skeleton: 'var(--skeleton)',
                dark: {
                    'primary-1': 'var(--dark-primary-1)',
                    'secondary-1': 'var(--dark-secondary-1)',
                    'secondary-2': 'var(--dark-secondary-2)',
                    'background-1': 'var(--dark-background-1)',
                },
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                chart: {
                    '1': 'hsl(var(--chart-1))',
                    '2': 'hsl(var(--chart-2))',
                    '3': 'hsl(var(--chart-3))',
                    '4': 'hsl(var(--chart-4))',
                    '5': 'hsl(var(--chart-5))',
                },
            },
            backgroundColor: {
                'hover-1': 'var(--hover-1)',
                'hover-2': 'var(--hover-2)',
                'hover-blue': 'var(--hover-blue)',
                'hover-warning': 'var(--hover-warning)',
                'hover-secondary': 'var(--hover-secondary)',
                'hover-secondary-dark': 'var(--hover-secondary-dark)',
                dark: {
                    'hover-1': 'var(--dark-hover-1)',
                    'hover-2': 'var(--dark-hover-2)',
                },
                warning: 'var(--warning)',
            },
            keyframes: {
                skeleton: {
                    '0%': {
                        opacity: 0.25,
                    },
                    '100%': {
                        opacity: 1,
                    },
                },
            },
            animation: {
                skeleton: 'skeleton 1s steps(10, end) infinite alternate 0ms',
            },
            gridTemplateColumns: {
                photo: 'repeat(auto-fit, minmax(250px, 1fr))',
            },
            boxShadow: {
                md: '0 1px 5px 1px rgba(0, 0, 0, 0.1)',
            },
            maxWidth: {
                screen: '100vw',
            },
        },
        screens: {
            '2xl': {
                max: '1535px',
            },
            xl: {
                max: '1200px',
            },
            lg: {
                max: '992px',
            },
            md: {
                max: '768px',
            },
            sm: {
                max: '639px',
            },
        },
    },
    plugins: [require('tailwindcss-animate')],
    darkMode: ['class'],
};
