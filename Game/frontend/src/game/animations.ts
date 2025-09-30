/**
 * Animation system and utilities for Golden Fortune Slots
 */

export interface AnimationConfig {
	duration: number;
	easing?: (t: number) => number;
	onUpdate?: (progress: number) => void;
	onComplete?: () => void;
}

export class Animation {
	private startTime: number | null = null;
	private isRunning = false;
	private rafId: number | null = null;

	constructor(private config: AnimationConfig) {}

	start(): void {
		if (this.isRunning) {
			return;
		}

		this.isRunning = true;
		this.startTime = performance.now();
		this.animate();
	}

	stop(): void {
		this.isRunning = false;
		if (this.rafId !== null) {
			cancelAnimationFrame(this.rafId);
			this.rafId = null;
		}
	}

	private animate = (): void => {
		if (!this.isRunning || this.startTime === null) {
			return;
		}

		const elapsed = performance.now() - this.startTime;
		const progress = Math.min(elapsed / this.config.duration, 1);
		const easedProgress = this.config.easing ? this.config.easing(progress) : progress;

		this.config.onUpdate?.(easedProgress);

		if (progress < 1) {
			this.rafId = requestAnimationFrame(this.animate);
		} else {
			this.isRunning = false;
			this.config.onComplete?.();
		}
	};
}

// Easing functions
export const Easing = {
	linear: (t: number) => t,

	easeInQuad: (t: number) => t * t,
	easeOutQuad: (t: number) => t * (2 - t),
	easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),

	easeInCubic: (t: number) => t * t * t,
	easeOutCubic: (t: number) => --t * t * t + 1,
	easeInOutCubic: (t: number) =>
		t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

	easeInQuart: (t: number) => t * t * t * t,
	easeOutQuart: (t: number) => 1 - --t * t * t * t,
	easeInOutQuart: (t: number) =>
		t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,

	easeInElastic: (t: number) => {
		if (t === 0 || t === 1) return t;
		const p = 0.3;
		return -Math.pow(2, 10 * (t - 1)) * Math.sin(((t - 1 - p / 4) * (2 * Math.PI)) / p);
	},
	easeOutElastic: (t: number) => {
		if (t === 0 || t === 1) return t;
		const p = 0.3;
		return Math.pow(2, -10 * t) * Math.sin(((t - p / 4) * (2 * Math.PI)) / p) + 1;
	},

	easeInBounce: (t: number) => 1 - Easing.easeOutBounce(1 - t),
	easeOutBounce: (t: number) => {
		if (t < 1 / 2.75) {
			return 7.5625 * t * t;
		} else if (t < 2 / 2.75) {
			return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
		} else if (t < 2.5 / 2.75) {
			return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
		} else {
			return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
		}
	},

	easeInBack: (t: number) => {
		const s = 1.70158;
		return t * t * ((s + 1) * t - s);
	},
	easeOutBack: (t: number) => {
		const s = 1.70158;
		return --t * t * ((s + 1) * t + s) + 1;
	},
};

// Animation sequence manager
export class AnimationSequence {
	private animations: Array<() => Promise<void>> = [];
	private isPlaying = false;

	add(fn: () => Promise<void>): this {
		this.animations.push(fn);
		return this;
	}

	addDelay(ms: number): this {
		this.animations.push(() => this.delay(ms));
		return this;
	}

	async play(): Promise<void> {
		if (this.isPlaying) {
			return;
		}

		this.isPlaying = true;

		for (const animation of this.animations) {
			await animation();
		}

		this.isPlaying = false;
	}

	stop(): void {
		this.isPlaying = false;
	}

	clear(): void {
		this.animations = [];
		this.isPlaying = false;
	}

	private delay(ms: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
}

// Utility function to animate a value
export function animateValue(
	from: number,
	to: number,
	duration: number,
	onUpdate: (value: number) => void,
	easing: (t: number) => number = Easing.easeOutQuad
): Promise<void> {
	return new Promise(resolve => {
		const animation = new Animation({
			duration,
			easing,
			onUpdate: progress => {
				const value = from + (to - from) * progress;
				onUpdate(value);
			},
			onComplete: resolve,
		});

		animation.start();
	});
}

// Reel spin animation helpers
export interface ReelSpinConfig {
	acceleration: number;
	maxSpeed: number;
	deceleration: number;
	stopDelay: number;
}

export const DEFAULT_REEL_SPIN_CONFIG: ReelSpinConfig = {
	acceleration: 0.02,
	maxSpeed: 60,
	deceleration: 0.05,
	stopDelay: 100,
};

export class ReelSpinAnimation {
	private velocity = 0;
	private position = 0;
	private isAccelerating = true;
	private isDecelerating = false;
	private targetPosition = 0;

	constructor(
		private config: ReelSpinConfig = DEFAULT_REEL_SPIN_CONFIG,
		private onUpdate: (position: number) => void
	) {}

	start(): void {
		this.velocity = 0;
		this.position = 0;
		this.isAccelerating = true;
		this.isDecelerating = false;
	}

	update(deltaTime: number): void {
		if (this.isAccelerating) {
			this.velocity += this.config.acceleration * deltaTime;
			if (this.velocity >= this.config.maxSpeed) {
				this.velocity = this.config.maxSpeed;
				this.isAccelerating = false;
			}
		} else if (this.isDecelerating) {
			this.velocity -= this.config.deceleration * deltaTime;
			if (this.velocity <= 0) {
				this.velocity = 0;
				this.position = this.targetPosition;
			}
		}

		this.position += this.velocity * deltaTime;
		this.onUpdate(this.position);
	}

	stop(targetPosition: number): void {
		this.targetPosition = targetPosition;
		this.isDecelerating = true;
	}

	get isStopped(): boolean {
		return this.velocity === 0 && this.isDecelerating;
	}
}
