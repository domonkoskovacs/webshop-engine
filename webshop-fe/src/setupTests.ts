import '@testing-library/jest-dom';

global.window.matchMedia = global.window.matchMedia || ((query) => {
    return {
        matches: query === "(prefers-color-scheme: dark)",
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    };
});

global.window.scrollTo = jest.fn();