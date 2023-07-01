import {baseViteConfig} from 'virmator/dist/compiled-base-configs/base-vite';
import {defineConfig} from 'vite';

export default defineConfig({
    ...baseViteConfig,
    base: '/bitgen-example',
    server: {
        host: '127.0.0.1',
        headers: {
            'Content-Security-Policy': "default-src 'unsafe-inline' 'self' blob: data:",
        },
    },
});
