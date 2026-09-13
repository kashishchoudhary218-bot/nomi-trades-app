import React from 'react';
import Svg, { Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import { TerminalChartData } from '../../engine/charts';

interface Props {
  data: TerminalChartData;
  ema: boolean;
  cross: boolean;
  baselineColor: string;
}

export function CandlestickChart({ data, ema, cross, baselineColor }: Props) {
  return (
    <Svg viewBox="0 0 326 210" width="100%" height={210} fill="none">
      {data.gridLines.map((g, i) => (
        <Line key={i} x1={0} y1={g.y} x2={326} y2={g.y} stroke="rgba(255,255,255,.045)" strokeWidth={1} />
      ))}
      {data.candles.map((k, i) => (
        <React.Fragment key={i}>
          <Line x1={k.cx} y1={k.hy} x2={k.cx} y2={k.ly} stroke={k.color} strokeWidth={1.1} />
          <Rect x={k.x} y={k.y} width={k.w} height={k.h} fill={k.color} rx={1} />
        </React.Fragment>
      ))}
      {ema ? <Path d={data.emaPath} stroke="#C8FF4D" strokeWidth={1.6} fill="none" strokeLinecap="round" /> : null}
      {cross ? (
        <>
          <Line x1={238} y1={0} x2={238} y2={210} stroke="rgba(255,255,255,.22)" strokeWidth={1} strokeDasharray="3 3" />
          <Line x1={0} y1={data.lastY} x2={326} y2={data.lastY} stroke="rgba(255,255,255,.22)" strokeWidth={1} strokeDasharray="3 3" />
        </>
      ) : null}
      <Line x1={0} y1={data.lastY} x2={326} y2={data.lastY} stroke={baselineColor} strokeWidth={1} strokeDasharray="5 4" />
      {data.priceAxis.map((p, i) => (
        <SvgText key={i} x={322} y={p.y} textAnchor="end" fill="#5c6a77" fontSize={9} fontFamily="IBMPlexSans_400Regular">
          {p.label}
        </SvgText>
      ))}
    </Svg>
  );
}
