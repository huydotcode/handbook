/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        screens: {
            '2xl': { max: '1535px' },
            xl: { max: '1200px' },
            lg: { max: '992px' },
            md: { max: '768px' },
            sm: { max: '639px' },
        },
        extend: {
            colors: {
                // Light
                primary: '#e4e6eb',
                secondary: '#65676b',

                // Dark
                'dark-100': '#050505',
            },
            backgroundColor: {
                // Light
                primary: '#3b82f6',
                secondary: '#f0f2f5',

                'light-100': '#e4e6eb',
                'light-500': '#606770',

                // Dark
                'dark-100': '#18191A',
                'dark-200': '#242526',

                'dark-500': '#626262',
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
    },
    plugins: [],
    darkMode: 'class',
};
