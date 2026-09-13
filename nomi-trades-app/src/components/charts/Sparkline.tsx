import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface Props {
  path: string;
  stroke: string;
  width: number;
  height: number;
  /** Markets rows draw a faint dashed midline behind the spark; movers cards don't. */
  dashedMidline?: boolean;
}

export function Sparkline({ path, stroke, width, height, dashedMidline }: Props) {
  return (
    <Svg width={width} height={height} viewBox="0 0 120 40" fill="none">
      <Path d={path} stroke={stroke} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      {dashedMidline ? <Path d="M0 20H120" stroke="rgba(255,255,255,.14)" strokeWidth={1} strokeDasharray="4 4" /> : null}
    </Svg>
  );
}
