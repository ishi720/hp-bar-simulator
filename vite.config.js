import { defineConfig, loadEnv } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// VITE_GA_ID が設定されているときだけ Google アナリティクスのタグを埋め込む
function googleAnalytics(id) {
    return {
        name: 'google-analytics',
        transformIndexHtml() {
            if (!id) return [];
            if (!/^G-[A-Z0-9]+$/.test(id)) {
                throw new Error(`VITE_GA_ID の形式が不正です: ${id}`);
            }
            return [
                {
                    tag: 'script',
                    attrs: { async: true, src: `https://www.googletagmanager.com/gtag/js?id=${id}` },
                    injectTo: 'head',
                },
                {
                    tag: 'script',
                    children: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}');`,
                    injectTo: 'head',
                },
            ];
        },
    };
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), 'VITE_');
    return {
        base: './',
        plugins: [svelte(), googleAnalytics(env.VITE_GA_ID)],
    };
});
