import type React from 'react';
import {S05, S06, S07} from './Ch01Math';
import {S08, S09, S10, S11, S12} from './Ch02Machine';
import {S13} from './Ch03Reality';
import {S14, S15, S16, S17} from './Ch04Principles';
import {S18, S19, S20, S21} from './Ch05Toolkit';
import {S22, S23} from './Ch06Rule';
import {S24, S25} from './Ch07Execution';
import {S26, S27} from './Ch08Drawdown';
import {S28, S29, S30, S31, S32} from './Ch09Traps';
import {S33, S34, S35} from './Closing';
import {S01, S02, S03, S04} from './ColdOpen';

/** Scene ID → component. Every ID in data/scenes.ts must be registered here. */
export const SCENE_COMPONENTS: Record<string, React.FC> = {
	S01, S02, S03, S04,
	S05, S06, S07,
	S08, S09, S10, S11, S12,
	S13,
	S14, S15, S16, S17,
	S18, S19, S20, S21,
	S22, S23,
	S24, S25,
	S26, S27,
	S28, S29, S30, S31, S32,
	S33, S34, S35,
};
