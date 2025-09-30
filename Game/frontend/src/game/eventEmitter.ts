/**
 * Event emitter setup for Golden Fortune Slots
 */

import type { EmitterEventGame } from './typesEmitterEvent';

type EmitterEvent = EmitterEventGame;

class EventEmitter<T extends { type: string }> {
	private handlers: Map<string, Set<(event: T) => void | Promise<void>>> = new Map();

	broadcast(event: T): void {
		const handlers = this.handlers.get(event.type);
		if (handlers) {
			handlers.forEach((handler) => handler(event));
		}
	}

	async broadcastAsync(event: T): Promise<void> {
		const handlers = this.handlers.get(event.type);
		if (handlers) {
			await Promise.all(Array.from(handlers).map((handler) => handler(event)));
		}
	}

	subscribe(type: string, handler: (event: T) => void | Promise<void>): () => void {
		if (!this.handlers.has(type)) {
			this.handlers.set(type, new Set());
		}
		this.handlers.get(type)!.add(handler);

		return () => {
			const handlers = this.handlers.get(type);
			if (handlers) {
				handlers.delete(handler);
			}
		};
	}

	subscribeOnMount(handlerMap: Record<string, (event: any) => void | Promise<void>>): void {
		Object.entries(handlerMap).forEach(([type, handler]) => {
			this.subscribe(type, handler);
		});
	}
}

export const eventEmitter = new EventEmitter<EmitterEvent>();

export { type EmitterEvent };
