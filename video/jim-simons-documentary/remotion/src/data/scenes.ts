import type {TransitionKind} from '../components/Transition';
import type {MusicCueId, SfxId} from '../audio/library';
import type {ChapterId} from './chapters';

/**
 * Single source of truth for the film: narration (verbatim from STORYBOARD.md §6),
 * minimum durations (from the storyboard timecodes), transitions, music and SFX cues.
 *
 * Every factual line traces to the source PDF — see STORYBOARD.md §11.
 * Scene lengths auto-extend to fit the recorded voiceover (see timeline/build.ts).
 */
export type SfxCue = {
	id: SfxId;
	/** Phrase in the narration the hit lands on (preferred — follows the real VO timing)… */
	on?: string;
	/** …or a fixed offset in seconds from scene start. */
	atSec?: number;
	volume?: number;
};

export type SceneDef = {
	id: string;
	chapter: ChapterId;
	title: string;
	/** Storyboard length; the scene will never be shorter than this. */
	minDurationSec: number;
	/** VO text; empty string = music-only scene. */
	narration: string;
	/** Seconds from scene start to VO start (chapter-card scenes wait for the card). */
	voOffsetSec: number;
	/** Chapter card at the top of the scene. */
	chapterCard?: boolean;
	/** Transition INTO the next scene. */
	transitionOut: TransitionKind;
	transitionFrames?: number;
	music: MusicCueId;
	sfx: SfxCue[];
	/**
	 * Set by localizeScenes() for non-English narration: English beat phrase → phrase in
	 * this narration. Keys/values may carry "#n" for the nth occurrence.
	 */
	anchors?: Record<string, string>;
};

const CARD_VO_OFFSET = 2.3;

export const SCENES: SceneDef[] = [
	// ───────────── COLD OPEN ─────────────
	{
		id: 'S01', chapter: 'cold-open', title: 'The Number', minDurationSec: 13, voOffsetSec: 0.6,
		narration: "Sixty-six percent. That's roughly the average annual return Jim Simons' Medallion Fund reportedly generated before fees — for more than thirty years.",
		transitionOut: 'data-dissolve', music: 'M1',
		sfx: [{id: 'SFX-02', atSec: 0.3}, {id: 'SFX-01', atSec: 1.9}, {id: 'SFX-04', on: 'more than thirty years'}],
	},
	{
		id: 'S02', chapter: 'cold-open', title: 'Not Instinct', minDurationSec: 15, voOffsetSec: 0.3,
		narration: "And it didn't come from gut feelings, market stories, or a star trader's instinct. It came from mathematics, data, and scientific discipline.",
		transitionOut: 'cut', music: 'M1',
		sfx: [{id: 'SFX-09', on: 'gut feelings'}, {id: 'SFX-09', on: 'market stories'}, {id: 'SFX-09', on: 'instinct'}, {id: 'SFX-07', on: 'instinct', volume: 0.4}, {id: 'SFX-04', on: 'mathematics'}],
	},
	{
		id: 'S03', chapter: 'cold-open', title: 'The Promise', minDurationSec: 18, voOffsetSec: 0.2,
		narration: "In this video: how Simons approached markets, what actually drove his edge — and, most importantly, which of his principles a retail trader can realistically use. And which ones you can't.",
		transitionOut: 'cut', music: 'M1',
		sfx: [{id: 'SFX-04', on: 'approached'}, {id: 'SFX-04', on: 'drove his edge'}, {id: 'SFX-04', on: 'realistically use'}, {id: 'SFX-07', on: 'which ones'}, {id: 'SFX-11', on: "can't", volume: 0.8}],
	},
	{
		id: 'S04', chapter: 'cold-open', title: 'Title Sequence', minDurationSec: 8, voOffsetSec: 0,
		narration: '',
		transitionOut: 'signal-wipe', music: 'M1',
		sfx: [{id: 'SFX-03', atSec: 0.2}, {id: 'SFX-01', atSec: 1.4}],
	},

	// ───────────── 01 MARKETS AS A MATH PROBLEM ─────────────
	{
		id: 'S05', chapter: 'ch01', title: '1982', minDurationSec: 15, voOffsetSec: CARD_VO_OFFSET, chapterCard: true,
		narration: 'In 1982, Jim Simons founded Renaissance Technologies. Simons was a mathematician and a former signals analyst — and he looked at markets differently from traditional traders.',
		transitionOut: 'data-dissolve', music: 'M2',
		sfx: [{id: 'SFX-02', on: '1982'}, {id: 'SFX-04', on: 'mathematician'}],
	},
	{
		id: 'S06', chapter: 'ch01', title: 'The Core Idea', minDurationSec: 20, voOffsetSec: 0.3,
		narration: 'His core idea was easy to state and hard to execute: financial market data may contain persistent, predictable patterns. Combine the right people, the right data, and the right technology — and those patterns could be identified and traded systematically.',
		transitionOut: 'data-dissolve', music: 'M2',
		sfx: [{id: 'SFX-04', on: 'persistent'}, {id: 'SFX-04', on: 'predictable'}, {id: 'SFX-04', on: 'patterns'}, {id: 'SFX-01', on: 'traded systematically', volume: 0.5}],
	},
	{
		id: 'S07', chapter: 'ch01', title: 'Scientists, Not Storytellers', minDurationSec: 25, voOffsetSec: 0.3,
		narration: "So Renaissance didn't build its approach on traditional, qualitative market analysis. It built it on statistical pattern recognition. The firm employed mathematicians, physicists, and computer scientists — people who believed markets could be studied like a mathematical system, where scientific discipline could reveal hidden patterns.",
		transitionOut: 'signal-wipe', music: 'M2',
		sfx: [{id: 'SFX-09', on: 'qualitative'}, {id: 'SFX-08', on: 'statistical pattern recognition'}, {id: 'SFX-04', on: 'mathematicians'}, {id: 'SFX-04', on: 'physicists'}, {id: 'SFX-04', on: 'computer scientists'}],
	},

	// ───────────── 02 THE MACHINE BEHIND THE EDGE ─────────────
	{
		id: 'S08', chapter: 'ch02', title: 'Not Just Models', minDurationSec: 20, voOffsetSec: CARD_VO_OFFSET, chapterCard: true,
		narration: "But here's what most people miss: Renaissance's performance wasn't only about models. Several factors mattered together — execution quality, scientific discipline, data analysis, continuous research, and the scientists it hired. Let's break down four of them.",
		transitionOut: 'crossfade', music: 'M2',
		sfx: [{id: 'SFX-04', on: 'execution quality'}, {id: 'SFX-04', on: 'scientific discipline'}, {id: 'SFX-04', on: 'data analysis'}, {id: 'SFX-04', on: 'continuous research'}, {id: 'SFX-01', on: 'break down', volume: 0.5}],
	},
	{
		id: 'S09', chapter: 'ch02', title: 'Pillar 1 · Statistical Pattern Recognition', minDurationSec: 19, voOffsetSec: 0.3,
		narration: 'One: statistical pattern recognition. The team processed price, volume, order flow and other market data. The goal: find signals that were statistically significant, repeated over time — and stayed useful even after trading costs.',
		transitionOut: 'crossfade', music: 'M2',
		sfx: [{id: 'SFX-08', on: 'statistically significant'}, {id: 'SFX-08', on: 'repeated over time'}, {id: 'SFX-08', on: 'after trading costs'}],
	},
	{
		id: 'S10', chapter: 'ch02', title: 'Pillar 2 · Borrowed from Physics', minDurationSec: 22, voOffsetSec: 0.3,
		narration: 'Two: borrowing from other sciences. Some mathematical techniques were adapted from fields outside finance, like physics and signal processing. Hidden Markov Models were reportedly used in financial pattern recognition. The logic: if a technique works in complex systems elsewhere, test whether it works in markets too.',
		transitionOut: 'data-dissolve', music: 'M2',
		sfx: [{id: 'SFX-04', on: 'Hidden Markov Models'}],
	},
	{
		id: 'S11', chapter: 'ch02', title: 'Pillar 3 · Speed, Consistency, Scale', minDurationSec: 22, voOffsetSec: 0.3,
		narration: "Three: speed, consistency and scale. Finding a profitable signal isn't enough. It has to be executed quickly, consistently, and at scale. And notably, Renaissance intentionally kept the Medallion Fund's capacity limited — so its large orders wouldn't excessively affect market prices.",
		transitionOut: 'cut', music: 'M2',
		sfx: [{id: 'SFX-03', on: 'speed'}, {id: 'SFX-03', on: 'consistency'}, {id: 'SFX-03', on: 'and scale'}, {id: 'SFX-12', on: 'capacity limited'}],
	},
	{
		id: 'S12', chapter: 'ch02', title: 'Pillar 4 · The Discipline Loop', minDurationSec: 24, voOffsetSec: 0.3,
		narration: 'Four: model discipline. A signal was traded only if there was statistically significant evidence behind it. If a signal stopped working, it was removed. And the process never stopped: research, test, trade live, monitor — then improve, or remove.',
		transitionOut: 'dip-to-black', transitionFrames: 36, music: 'M2',
		sfx: [{id: 'SFX-04', on: 'research'}, {id: 'SFX-04', on: 'test'}, {id: 'SFX-04', on: 'trade live'}, {id: 'SFX-04', on: 'monitor'}, {id: 'SFX-09', on: 'or remove'}],
	},

	// ───────────── 03 THE REALITY CHECK ─────────────
	{
		id: 'S13', chapter: 'ch03', title: "You Can't Copy This", minDurationSec: 26, voOffsetSec: CARD_VO_OFFSET, chapterCard: true,
		narration: "Now, a reality check. A retail trader cannot replicate the Medallion Fund's performance. Its models are proprietary and not publicly available. Renaissance had technology, scale, and highly skilled researchers. So treat Simons' principles as a learning framework — not a trading strategy to copy.",
		transitionOut: 'signal-wipe', music: 'M3',
		sfx: [{id: 'SFX-01', on: 'proprietary'}, {id: 'SFX-09', on: 'not a trading strategy'}, {id: 'SFX-08', on: 'learning framework'}],
	},

	// ───────────── 04 FOUR PRINCIPLES ─────────────
	{
		id: 'S14', chapter: 'ch04', title: 'Principle 1 · Rules Over Judgement', minDurationSec: 24, voOffsetSec: CARD_VO_OFFSET, chapterCard: true,
		narration: 'So what can you actually apply? Principle one: systematic rules over discretionary judgement. Define your entry, exit, stop loss and position size in advance. Measurable conditions can reduce behavioural mistakes like overconfidence, hesitation and confirmation bias.',
		transitionOut: 'crossfade', music: 'M4',
		sfx: [{id: 'SFX-05', on: 'entry'}, {id: 'SFX-05', on: 'stop loss'}, {id: 'SFX-08', on: 'in advance'}],
	},
	{
		id: 'S15', chapter: 'ch04', title: 'Principle 2 · Evidence Over Narrative', minDurationSec: 29, voOffsetSec: 0.3,
		narration: "Principle two: put data and evidence above narrative. Backtest your strategy on historical data. Learn where it performs, where it fails, what its historical drawdown was, its win rate, and its average risk-to-reward. A backtest doesn't guarantee future profit — but it gives you a baseline for understanding how the strategy has behaved.",
		transitionOut: 'data-dissolve', music: 'M4',
		sfx: [{id: 'SFX-07', on: 'above narrative', volume: 0.4}, {id: 'SFX-04', on: 'performs'}, {id: 'SFX-04', on: 'fails'}, {id: 'SFX-04', on: 'drawdown'}, {id: 'SFX-04', on: 'win rate'}, {id: 'SFX-04', on: 'risk-to-reward'}],
	},
	{
		id: 'S16', chapter: 'ch04', title: 'Principle 3 · Risk Is Non-Negotiable', minDurationSec: 27, voOffsetSec: 0.3,
		narration: "Principle three: risk management is non-negotiable. Keep position sizing consistent. Define a maximum loss per trade. Define a daily and weekly maximum loss. And don't increase risk just because you're on a winning streak. The goal: no single trade — or sequence of trades — should seriously damage your account.",
		transitionOut: 'crossfade', music: 'M4',
		sfx: [{id: 'SFX-08', on: 'consistent'}, {id: 'SFX-08', on: 'per trade'}, {id: 'SFX-08', on: 'weekly maximum loss'}, {id: 'SFX-08', on: 'winning streak'}, {id: 'SFX-09', on: 'seriously damage', volume: 0.5}],
	},
	{
		id: 'S17', chapter: 'ch04', title: 'Principle 4 · Diversify', minDurationSec: 30, voOffsetSec: 0.3,
		narration: 'Principle four: diversify across markets and signals. Medallion reportedly traded hundreds of instruments — equities, bonds, currencies, commodities and derivatives. At retail level, the broad lesson is: don\'t depend completely on one instrument or one strategy. Diversifying across less-correlated markets can reduce your dependence on any single edge.',
		transitionOut: 'signal-wipe', music: 'M4',
		sfx: [{id: 'SFX-04', on: 'hundreds of instruments'}, {id: 'SFX-09', on: 'one instrument'}],
	},

	// ───────────── 05 THE QUANT TOOLKIT ─────────────
	{
		id: 'S18', chapter: 'ch05', title: 'Statistical Arbitrage', minDurationSec: 22, voOffsetSec: CARD_VO_OFFSET, chapterCard: true,
		narration: 'Quantitative strategies come in a few broad types. Statistical arbitrage studies the price relationship between historically related assets. If that relationship temporarily widens to an unusual level, the strategy tests whether the spread will revert toward its normal range.',
		transitionOut: 'crossfade', music: 'M4',
		sfx: [{id: 'SFX-11', on: 'widens', volume: 0.5}, {id: 'SFX-08', on: 'normal range'}],
	},
	{
		id: 'S19', chapter: 'ch05', title: 'Momentum & Trend Following', minDurationSec: 16, voOffsetSec: 0.3,
		narration: 'Momentum and trend following try to systematically capture the possibility that recent strength continues — using rules like going long in an uptrend, and short in a downtrend.',
		transitionOut: 'crossfade', music: 'M4',
		sfx: [{id: 'SFX-04', on: 'long'}, {id: 'SFX-04', on: 'short'}],
	},
	{
		id: 'S20', chapter: 'ch05', title: 'Mean Reversion', minDurationSec: 20, voOffsetSec: 0.3,
		narration: 'Mean reversion tests the idea that price may return to its average, or equilibrium, level. It can be relevant in short-term trading — but the challenge is telling a temporary overextension apart from the beginning of a new trend.',
		transitionOut: 'crossfade', music: 'M4',
		sfx: [{id: 'SFX-04', on: 'temporary overextension'}, {id: 'SFX-04', on: 'new trend'}],
	},
	{
		id: 'S21', chapter: 'ch05', title: 'Factor-Based Models', minDurationSec: 17, voOffsetSec: 0.3,
		narration: "And factor-based models analyse characteristics like value, momentum, quality and low volatility. Instead of predicting one stock's direction, the portfolio is tilted toward specific factor exposures.",
		transitionOut: 'signal-wipe', music: 'M4',
		sfx: [{id: 'SFX-09', on: 'predicting'}, {id: 'SFX-08', on: 'tilted'}],
	},

	// ───────────── 06 YOUR FIRST TESTABLE RULE ─────────────
	{
		id: 'S22', chapter: 'ch06', title: 'One Precise Rule', minDurationSec: 26, voOffsetSec: CARD_VO_OFFSET, chapterCard: true,
		narration: "The good news: a quantitative approach doesn't need Renaissance-level mathematics. It starts with one precise, testable rule. For example: I'll buy when the 20-day moving average crosses above the 50-day moving average. And I'll exit when the 20-day crosses back below the 50-day.",
		transitionOut: 'crossfade', music: 'M4',
		sfx: [{id: 'SFX-05', on: "I'll buy"}, {id: 'SFX-05', on: "I'll exit"}],
	},
	{
		id: 'S23', chapter: 'ch06', title: 'Now Test It', minDurationSec: 15, voOffsetSec: 0.3,
		narration: 'Now that rule can be backtested on historical data — checking the win rate, drawdown, average risk-to-reward, and how it behaves across different market conditions.',
		transitionOut: 'data-dissolve', music: 'M4',
		sfx: [{id: 'SFX-04', on: 'win rate'}, {id: 'SFX-04', on: 'drawdown'}, {id: 'SFX-04', on: 'risk-to-reward'}, {id: 'SFX-04', on: 'market conditions'}],
	},

	// ───────────── 07 EXECUTION ─────────────
	{
		id: 'S24', chapter: 'ch07', title: 'How Traders Break Their Own Systems', minDurationSec: 26, voOffsetSec: CARD_VO_OFFSET, chapterCard: true,
		narration: 'Building a strategy is one challenge. Executing it consistently is an even bigger one. Here\'s where traders break their own systems: taking some signals and skipping others. Moving the stop loss. Holding a losing trade, hoping it recovers. And abandoning the strategy after a drawdown.',
		transitionOut: 'crossfade', music: 'M5',
		sfx: [{id: 'SFX-10', atSec: 2.5, volume: 0.6}, {id: 'SFX-09', on: 'skipping'}, {id: 'SFX-09', on: 'moving the stop loss'}, {id: 'SFX-09', on: 'hoping'}, {id: 'SFX-09', on: 'abandoning'}],
	},
	{
		id: 'S25', chapter: 'ch07', title: 'The Trade Journal', minDurationSec: 30, voOffsetSec: 0.3,
		narration: "The fix is a trade journal. Log the entry condition, entry price, exit price, stop loss, take profit, market condition, and the result. Then compare: is your live performance similar to the backtest's behaviour? If it's significantly worse, possible reasons include overfitting, changed market conditions, execution problems — or an edge that's degrading.",
		transitionOut: 'crossfade', music: 'M5',
		sfx: [{id: 'SFX-06', on: 'trade journal'}, {id: 'SFX-04', on: 'overfitting'}, {id: 'SFX-04', on: 'changed market conditions'}, {id: 'SFX-04', on: 'execution problems'}, {id: 'SFX-04', on: 'degrading'}],
	},

	// ───────────── 08 WHEN IT STOPS WORKING ─────────────
	{
		id: 'S26', chapter: 'ch08', title: 'Normal Drawdown, or Broken Edge?', minDurationSec: 32, voOffsetSec: CARD_VO_OFFSET, chapterCard: true,
		narration: 'Even systematic strategies go through drawdown periods. The important question isn\'t just "did I lose?" — it\'s whether this is a normal historical drawdown, or whether the strategy\'s edge has genuinely changed. Ask: Has the market regime changed? Are similar strategies also underperforming? Are the signal conditions still being generated? How different is the current market from historical conditions?',
		transitionOut: 'crossfade', music: 'M5',
		sfx: [{id: 'SFX-04', on: 'market regime'}, {id: 'SFX-04', on: 'similar strategies'}, {id: 'SFX-04', on: 'signal conditions'}, {id: 'SFX-04', on: 'how different'}],
	},
	{
		id: 'S27', chapter: 'ch08', title: "Don't Abandon on Emotion", minDurationSec: 16, voOffsetSec: 0.3,
		narration: 'After recent losses, it can feel like a strategy has failed permanently. But if it was properly backtested and validated, historical evidence gives you a better, more objective basis for evaluating the drawdown.',
		transitionOut: 'data-dissolve', music: 'M5',
		sfx: [{id: 'SFX-01', on: 'failed permanently', volume: 0.6}, {id: 'SFX-08', on: 'objective'}],
	},

	// ───────────── 09 THE TRAPS ─────────────
	{
		id: 'S28', chapter: 'ch09', title: 'Overfitting', minDurationSec: 24, voOffsetSec: CARD_VO_OFFSET, chapterCard: true,
		narration: 'Now, the advanced traps. The biggest one: overfitting — optimizing a strategy so tightly to historical data that the backtest looks strong, but it fails in live markets. The strategy may be learning historical noise instead of a real market pattern.',
		transitionOut: 'crossfade', music: 'M6',
		sfx: [{id: 'SFX-07', on: 'historical data', volume: 0.5}, {id: 'SFX-09', on: 'fails in live markets'}],
	},
	{
		id: 'S29', chapter: 'ch09', title: 'Out-of-Sample Testing', minDurationSec: 10, voOffsetSec: 0.3,
		narration: "One defence: out-of-sample testing — testing the strategy on separate data that wasn't used to develop it.",
		transitionOut: 'data-dissolve', music: 'M6',
		sfx: [{id: 'SFX-08', on: 'separate data'}],
	},
	{
		id: 'S30', chapter: 'ch09', title: 'The Hidden Tax: Transaction Costs', minDurationSec: 20, voOffsetSec: 0.3,
		narration: 'Then there are transaction costs. Your real cost isn\'t just the entry and exit price. Spread, commission, slippage or market impact, and overnight financing can all reduce an edge. High-turnover strategies are especially sensitive.',
		transitionOut: 'crossfade', music: 'M6',
		sfx: [{id: 'SFX-09', on: 'spread', volume: 0.5}, {id: 'SFX-09', on: 'commission', volume: 0.5}, {id: 'SFX-09', on: 'slippage', volume: 0.5}, {id: 'SFX-09', on: 'overnight financing', volume: 0.5}],
	},
	{
		id: 'S31', chapter: 'ch09', title: 'Capacity & Signal Decay', minDurationSec: 28, voOffsetSec: 0.3,
		narration: 'Capacity limits: if too much capital follows the same strategy, large orders can move the market and reduce returns — though for small retail accounts, this is usually less relevant. And signal degradation: an intraday pattern that once worked can become less effective over time — especially if many traders discover and start using it.',
		transitionOut: 'crossfade', music: 'M6',
		sfx: [{id: 'SFX-01', on: 'large orders', volume: 0.6}, {id: 'SFX-12', on: 'many traders'}],
	},
	{
		id: 'S32', chapter: 'ch09', title: 'Five Common Mistakes', minDurationSec: 60, voOffsetSec: 0.3,
		narration: "Finally, five common mistakes in systematic trading. One: over-complicating the model. More complexity doesn't automatically mean a better strategy; simple, robust models can be less vulnerable to overfitting. Two: using signals without a clear rationale. Finding a statistical pattern isn't enough; it helps to understand why it might exist. Three: testing on too little data. A short backtest can mislead. Test across high and low volatility, trending and range-bound markets, and different macro environments. Four: ignoring market regime change. Policy, volatility, liquidity and trader behaviour all shift — and all can affect performance. And five: not monitoring live conditions. Check whether today's market resembles the conditions where your strategy historically performed best.",
		transitionOut: 'dip-to-black', transitionFrames: 40, music: 'M6',
		sfx: [
			{id: 'SFX-04', on: 'One: over-complicating'}, {id: 'SFX-08', on: 'Two: using signals'},
			{id: 'SFX-04', on: 'Two: using signals'}, {id: 'SFX-08', on: 'Three: testing'},
			{id: 'SFX-04', on: 'Three: testing'}, {id: 'SFX-08', on: 'Four: ignoring'},
			{id: 'SFX-04', on: 'Four: ignoring'}, {id: 'SFX-08', on: 'And five'},
			{id: 'SFX-04', on: 'And five'}, {id: 'SFX-08', on: 'performed best'},
		],
	},

	// ───────────── CLOSING ─────────────
	{
		id: 'S33', chapter: 'closing', title: 'Copy the Discipline', minDurationSec: 22, voOffsetSec: 0.8,
		narration: "Renaissance's performance wasn't the product of models alone. It came from a process: find evidence, test it, trade it with discipline, monitor it — and remove what stops working. You can't copy Medallion. But you can copy the discipline.",
		transitionOut: 'crossfade', transitionFrames: 30, music: 'M7',
		sfx: [{id: 'SFX-01', on: 'copy the discipline', volume: 0.7}],
	},
	{
		id: 'S34', chapter: 'closing', title: 'Disclaimer', minDurationSec: 12, voOffsetSec: 0.5,
		narration: "This video is for education. Historical performance doesn't guarantee future results — and nothing here claims to replicate Medallion's proprietary models.",
		transitionOut: 'crossfade', music: 'M7',
		sfx: [],
	},
	{
		id: 'S35', chapter: 'closing', title: 'End Card', minDurationSec: 20, voOffsetSec: 0,
		narration: '',
		transitionOut: 'cut', music: 'M7',
		sfx: [{id: 'SFX-03', atSec: 0.3}],
	},
];
