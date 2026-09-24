import React from 'react';
import {AbsoluteFill, Series, useCurrentFrame} from 'remotion';
import {Background} from '../components/Background';
import {BigText} from '../components/BigText';
import {Chart} from '../components/Chart';
import {DataVisualization} from '../components/DataVisualization';
import {ImageScene} from '../components/ImageScene';
import {NumberCounter} from '../components/NumberCounter';
import {Kicker} from '../components/Primitives';
import {QuoteCard} from '../components/QuoteCard';
import {SectionTitle} from '../components/SectionTitle';
import {Subtitle} from '../components/Subtitle';
import {Timeline} from '../components/Timeline';
import {SignalSweep} from '../components/Transition';
import {BROLL} from '../data/broll';
import {maExample} from '../data/illustrative';
import {progress} from '../lib/anim';
import {SceneProvider} from '../timeline/SceneContext';
import {colors} from '../theme/tokens';

const DEMO = 120;

const Demo: React.FC<{name: string; children: React.ReactNode}> = ({name, children}) => (
	<SceneProvider value={{id: name, durationInFrames: DEMO, narration: '', voFrom: 0, voFrames: DEMO, contentOffset: 0}}>
		<Background>
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>{children}</AbsoluteFill>
			<div style={{position: 'absolute', top: 48, left: 60}}>
				<Kicker>{`<${name} />`}</Kicker>
			</div>
		</Background>
	</SceneProvider>
);

const SweepDemo: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<>
			<BigText text="Signal-line wipe · data dissolve · dip to black" font="sans" size={48} at={0} />
			<SignalSweep progress={progress(frame, 20, 60)} />
		</>
	);
};

const demos: [string, React.ReactNode][] = [
	['BigText', <BigText key="bt" text={'Mathematics.\nData. Discipline.'} size={130} highlight={['data']} underline={{at: 40}} />],
	['NumberCounter', <NumberCounter key="nc" to={66} prefix="~" suffix="%" size={260} at={6} />],
	['Subtitle', <Subtitle key="st" cues={[{from: 0, to: DEMO, text: 'Professional burned-in subtitles: balanced, two lines max, soft fades.'}]} />],
	[
		'Chart',
		<Chart
			key="ch"
			width={1500}
			height={620}
			title="MA(20) / MA(50) — ILLUSTRATIVE"
			series={[
				{id: 'p', data: maExample.price, color: colors.textLo, width: 2, drawDuration: 70},
				{id: 'f', data: maExample.ma20, color: colors.signal, drawFrom: 10, drawDuration: 70, glow: true},
				{id: 's', data: maExample.ma50, color: colors.cool, drawFrom: 16, drawDuration: 70},
			]}
			markers={maExample.crosses.map((c) => ({series: 'f', index: c.index, shape: c.direction === 'up' ? 'up' : 'down', color: c.direction === 'up' ? colors.gain : colors.textMid}))}
			playhead={{from: 20, duration: 90}}
		/>,
	],
	[
		'DataVisualization',
		<DataVisualization
			key="dv"
			type="waterfall"
			width={1400}
			height={600}
			start={{label: 'GROSS EDGE', value: 100}}
			steps={[{label: 'SPREAD', value: -14}, {label: 'COMMISSION', value: -10}, {label: 'SLIPPAGE', value: -16}, {label: 'FINANCING', value: -9}]}
			endLabel="NET EDGE"
			at={4}
			stagger={16}
		/>,
	],
	['SectionTitle', <SectionTitle key="se" number="04" title="Four Principles You Can Use" durationInFrames={DEMO} />],
	['Timeline', <Timeline key="tl" layout="loop" steps={['Research', 'Test', 'Live Trade', 'Monitor', 'Improve / Remove']} stepFrames={12} lapFrames={60} ejectAt={90} size={760} />],
	['QuoteCard', <QuoteCard key="qc" variant="code" lines={['IF  MA(20) crosses ABOVE MA(50)  →  BUY', 'IF  MA(20) crosses BELOW MA(50)  →  EXIT']} highlights={[{text: 'MA(20)', color: colors.signal}, {text: 'MA(50)', color: colors.cool}, {text: 'BUY', color: colors.gain}]} speed={1.2} />],
	['ImageScene', <ImageScene key="is" {...BROLL.B03} />],
	['Transition', <SweepDemo key="tr" />],
];

export const SHOWCASE_FRAMES = demos.length * DEMO;

/** Every reusable component in isolation — a living style guide. */
export const Showcase: React.FC = () => (
	<Series>
		{demos.map(([name, node]) => (
			<Series.Sequence key={name} durationInFrames={DEMO} name={name}>
				<Demo name={name}>{node}</Demo>
			</Series.Sequence>
		))}
	</Series>
);
