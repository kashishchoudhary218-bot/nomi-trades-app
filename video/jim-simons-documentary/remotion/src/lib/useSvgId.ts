import {useId} from 'react';

/**
 * Unique, CSS-safe id prefix for SVG defs (gradients, filters, clip paths).
 * Two scenes are mounted at once during transitions, so fixed ids like "glow" would collide.
 */
export const useSvgId = (name: string): ((part: string) => string) => {
	const base = `${name}-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
	return (part: string) => `${base}-${part}`;
};
