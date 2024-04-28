/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    content: [
        "./*.md",
        "./_layouts/**/*.html",
        "./_includes/**/*.html",
        "./_drafts/**/*.md",
        "./_posts/**/*.md",
    ],
    theme: {
        screens: {
            'xs': '480px',
            ...defaultTheme.screens,
        },
        extend: {
            colors: {
                "brand-red": '#11486A',
            },
            fontSize: {
                // 'custom-header': ['0.9rem', '1.5rem'],
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}

