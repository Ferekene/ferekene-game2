import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			pages: '.svelte-kit/output/prerendered/pages',
			assets: '.svelte-kit/output/client',
			fallback: undefined,
			precompress: false,
			strict: true
		}),
		prerender: {
			entries: ['*']
		}
	}
};
