/**
 * RGS Fetcher
 * Handles all HTTP requests to the RGS (Remote Gaming Server)
 */

export const rgsFetcher = {
	post: async function post<TResponse = any>(options: {
		url: string;
		rgsUrl: string;
		variables?: any;
	}): Promise<TResponse> {
		try {
			const response = await fetch(`https://${options.rgsUrl}${options.url}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(options.variables || {}),
			});

			if (response.status !== 200) {
				console.error('[RGS] Request failed:', response.status, response.statusText);
			}

			const data = await response.json();
			return data as TResponse;
		} catch (error) {
			console.error('[RGS] Fetch error:', error);
			throw error;
		}
	},

	get: async function get<TResponse = any>(options: {
		url: string;
		rgsUrl: string;
	}): Promise<TResponse> {
		try {
			const response = await fetch(`https://${options.rgsUrl}${options.url}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (response.status !== 200) {
				console.error('[RGS] Request failed:', response.status, response.statusText);
			}

			const data = await response.json();
			return data as TResponse;
		} catch (error) {
			console.error('[RGS] Fetch error:', error);
			throw error;
		}
	},
};
