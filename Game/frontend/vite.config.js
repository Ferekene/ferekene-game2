import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		port: 5173,
		strictPort: false
	},
	build: {
		target: 'esnext',
		minify: 'esbuild',
		sourcemap: false,
		cssCodeSplit: false,
		rollupOptions: {
			output: {
				manualChunks: undefined,
				inlineDynamicImports: false
			}
		}
	},
	optimizeDeps: {
		include: ['stake-engine', 'pixi.js', 'howler'],
		exclude: ['svelte-preprocess']
	},
	base: './',
	publicDir: 'static',
	logLevel: 'info'
});
