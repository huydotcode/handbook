/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            textColor: {
                'primary-1': 'var(--dark-primary-1)',
                'secondary-1': 'var(--secondary-text-1)',
                'dark-primary-1': 'var(--primary-1)',
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
                    '0%': { opacity: 0.25 },
                    '100%': { opacity: 1 },
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
        },
        screens: {
            '2xl': { max: '1535px' },
            xl: { max: '1200px' },
            lg: { max: '992px' },
            md: { max: '768px' },
            sm: { max: '639px' },
        },
    },
    plugins: [],
    darkMode: 'class',
};
