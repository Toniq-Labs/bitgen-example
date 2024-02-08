import {resolve} from 'path';
import {defineConfig} from 'virmator/dist/compiled-base-configs/base-vite';

export default defineConfig(
    {
        forGitHubPages: true,
        packageDirPath: resolve(__dirname, '..'),
    },
    (baseConfig) => {
        return {
            ...baseConfig,
            base: '/bitgen-example',
            server: {
                host: '127.0.0.1',
                headers: {
                    'Content-Security-Policy': "default-src 'unsafe-inline' 'self' blob: data:",
                },
            },
        };
    },
);
