import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {findAudio} from '../assets/assets';
import {MUSIC, SFX, voPath} from '../audio/library';
import {placeAudio} from '../audio/AudioLayer';
import {CHAPTERS} from '../data/chapters';
import {formatTimecode, type BuiltTimeline} from '../timeline/build';
import {fonts} from '../theme/fonts';
import {colors} from '../theme/tokens';

/**
 * Editor HUD (Studio only — toggle `showGuides`). Shows the current scene, timecode,
 * title-safe area and every audio cue at the playhead with a placeholder / ready flag.
 */
export const Guides: React.FC<{timeline: BuiltTimeline}> = ({timeline}) => {
	const frame = useCurrentFrame();
	const scene = [...timeline.scenes].reverse().find((s) => frame >= s.from) ?? timeline.scenes[0];
	const {vo, music, sfx} = placeAudio(timeline);
	const activeVo = vo.find((v) => frame >= v.from && frame < v.from + v.durationInFrames);
	const activeMusic = music.find((m) => frame >= m.from && frame < m.from + m.durationInFrames);
	const recentSfx = sfx.filter((s) => frame >= s.from && frame < s.from + 20);

	const row = (label: string, path: string | null, detail: string) => (
		<div key={label + detail} style={{display: 'flex', gap: 10, alignItems: 'center'}}>
			<span style={{width: 10, height: 10, borderRadius: 5, background: path ? colors.gain : colors.amber}} />
			<span style={{color: colors.textHi}}>{label}</span>
			<span style={{color: colors.textLo}}>{detail}</span>
			<span style={{color: path ? colors.gain : colors.amber}}>{path ? 'ready' : 'placeholder'}</span>
		</div>
	);

	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<div style={{position: 'absolute', inset: '5% 5%', border: `1px dashed ${colors.amber}55`}} />
			<div
				style={{
					position: 'absolute',
					top: 20,
					left: 20,
					padding: '12px 16px',
					background: 'rgba(0,0,0,0.75)',
					border: `1px solid ${colors.hairline}`,
					borderRadius: 8,
					fontFamily: fonts.mono,
					fontSize: 15,
					lineHeight: 1.6,
					color: colors.textMid,
				}}
			>
				<div style={{color: colors.signal}}>
					{formatTimecode(frame)} · {scene.def.id} · {CHAPTERS[scene.def.chapter].title} · {scene.def.title}
				</div>
				{activeVo ? row(`VO ${activeVo.sceneId}`, findAudio(voPath(activeVo.sceneId, timeline.language)), scene.voMeasured ? '(measured)' : '(estimated)') : null}
				{activeMusic ? row(`MUSIC ${activeMusic.id}`, findAudio(MUSIC[activeMusic.id].path), MUSIC[activeMusic.id].name) : null}
				{recentSfx.map((s) => row(s.id, findAudio(SFX[s.id].path), SFX[s.id].name))}
			</div>
		</AbsoluteFill>
	);
};
