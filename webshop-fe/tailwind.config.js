module.exports = {
    plugins: [
        require("tailwindcss-animate"),
        require('tailwind-scrollbar')({ nocompatible: true }),
    ],
    variants: {
        scrollbar: ['rounded'],
    },
}