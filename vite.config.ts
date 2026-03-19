/// <reference types="vitest" />
/// <reference types="vite/client" />

import {defineConfig} from 'vite'
import solidPlugin from 'vite-plugin-solid'
import devtools from 'solid-devtools/vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [
        devtools(),
        tailwindcss(),
        solidPlugin(),
    ],
    server: {
        port: 3000,
    },
    base: process.env.NODE_ENV === 'production' ? '/tilelayer-tester' : '',
    test: {
        environment: 'jsdom',
        globals: false,
        setupFiles: ['node_modules/@testing-library/jest-dom/vitest'],
        // if you have few tests, try commenting this
        // out to improve performance:
        isolate: false,
    },
    build: {
        target: 'esnext',
    },
    resolve: {
        conditions: ['development', 'browser'],
    },
})
