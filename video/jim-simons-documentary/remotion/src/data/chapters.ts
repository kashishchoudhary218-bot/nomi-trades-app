export type ChapterId = 'cold-open' | 'ch01' | 'ch02' | 'ch03' | 'ch04' | 'ch05' | 'ch06' | 'ch07' | 'ch08' | 'ch09' | 'closing';

export type Chapter = {id: ChapterId; number?: string; title: string};

export const CHAPTERS: Record<ChapterId, Chapter> = {
	'cold-open': {id: 'cold-open', title: 'Cold Open'},
	ch01: {id: 'ch01', number: '01', title: 'Markets as a Math Problem'},
	ch02: {id: 'ch02', number: '02', title: 'The Machine Behind the Edge'},
	ch03: {id: 'ch03', number: '03', title: 'The Reality Check'},
	ch04: {id: 'ch04', number: '04', title: 'Four Principles You Can Use'},
	ch05: {id: 'ch05', number: '05', title: 'The Quant Toolkit'},
	ch06: {id: 'ch06', number: '06', title: 'Your First Testable Rule'},
	ch07: {id: 'ch07', number: '07', title: 'The Hardest Part: Execution'},
	ch08: {id: 'ch08', number: '08', title: 'When It Stops Working'},
	ch09: {id: 'ch09', number: '09', title: 'The Traps'},
	closing: {id: 'closing', title: 'Closing'},
};
