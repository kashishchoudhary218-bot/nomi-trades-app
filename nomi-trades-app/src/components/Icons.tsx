import React from 'react';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';

export interface IconProps {
  size?: number;
  color?: string;
}

// Every icon below is ported 1:1 (same viewBox/path data) from the inline SVGs
// in the Claude Design prototype.

export function ClockIcon({ size = 17, color = '#93a1ad' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.7}>
      <Circle cx={12} cy={13} r={8} />
      <Path d="M12 10v3l2 2M5 3 3 5m16-2 2 2" />
    </Svg>
  );
}

export function BellIcon({ size = 17, color = '#93a1ad' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.7}>
      <Path d="M18 9a6 6 0 1 0-12 0c0 5-2 6-2 6h16s-2-1-2-6M10.5 20a2 2 0 0 0 3 0" />
    </Svg>
  );
}

export function ChevronRightIcon({ size = 16, color = '#5c6a77' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M9 6l6 6-6 6" />
    </Svg>
  );
}

export function ChevronLeftIcon({ size = 17, color = '#dbe3ea' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M15 6l-6 6 6 6" />
    </Svg>
  );
}

export function ChevronDownIcon({ size = 11, color = '#7d8b98' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4}>
      <Path d="M6 9l6 6 6-6" />
    </Svg>
  );
}

export function CandlesIcon({ size = 17, color = '#C8FF4D' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8}>
      <Path d="M8 3v4M8 17v4M16 3v3M16 14v7" />
      <Rect x={5} y={7} width={6} height={10} rx={1.5} />
      <Rect x={13} y={6} width={6} height={8} rx={1.5} />
    </Svg>
  );
}

/** Filled variant of the candlestick glyph used on the lime "Trade" action button. */
export function TradeGlyphIcon({ size = 21, color = '#0B0F14' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M8 3v4M8 17v4M16 3v3M16 14v7" />
      <Rect x={5} y={7} width={6} height={10} rx={1.5} fill={color} />
      <Rect x={13} y={6} width={6} height={8} rx={1.5} fill={color} />
    </Svg>
  );
}

export function SearchIcon({ size = 16, color = '#93a1ad' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Circle cx={11} cy={11} r={7} />
      <Path d="M16.5 16.5 21 21" />
    </Svg>
  );
}

export function EditIcon({ size = 11, color = '#7d8b98' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M4 20h4L20 8l-4-4L4 16v4z" />
    </Svg>
  );
}

export function DepositIcon({ size = 20, color = '#dbe3ea' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.9}>
      <Circle cx={12} cy={12} r={9} />
      <Path d="M12 7v9m-3.5-3.5L12 16l3.5-3.5" />
    </Svg>
  );
}

export function WithdrawIcon({ size = 20, color = '#dbe3ea' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.9}>
      <Circle cx={12} cy={12} r={9} />
      <Path d="M9 15l6-6m0 0h-4.5m4.5 0v4.5" />
    </Svg>
  );
}

export function MoreDotsIcon({ size = 20, color = '#dbe3ea' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Circle cx={12} cy={5.5} r={1.8} />
      <Circle cx={12} cy={12} r={1.8} />
      <Circle cx={12} cy={18.5} r={1.8} />
    </Svg>
  );
}

export function StarIcon({ size = 16, color = '#C8FF4D' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8}>
      <Path d="M12 4.5l2.3 4.8 5.2.7-3.8 3.6.9 5.2-4.6-2.5-4.6 2.5.9-5.2L4.5 10l5.2-.7z" />
    </Svg>
  );
}

export function CrosshairIcon({ size = 15, color = '#8d9aa6' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.7}>
      <Path d="M12 3v18M3 12h18" />
      <Circle cx={12} cy={12} r={3.4} />
    </Svg>
  );
}

export function MinusIcon({ size = 16, color = '#dbe3ea' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" stroke={color} strokeWidth={2.4}>
      <Path d="M5 12h14" />
    </Svg>
  );
}

export function PlusIcon({ size = 16, color = '#dbe3ea' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" stroke={color} strokeWidth={2.4}>
      <Path d="M12 5v14M5 12h14" />
    </Svg>
  );
}

export function CheckIcon({ size = 14, color = '#35D19A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.6}>
      <Path d="M5 13l4.5 4.5L19 7" />
    </Svg>
  );
}

export function SettingsIcon({ size = 21, color = '#93a1ad' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.7}>
      <Circle cx={12} cy={12} r={3.2} />
      <Path d="M12 2.8v2.4M12 18.8v2.4M4.5 7.5l2 1.2M17.5 15.3l2 1.2M4.5 16.5l2-1.2M17.5 8.7l2-1.2" />
    </Svg>
  );
}

// --- bottom tab icons ---

export function TabAccountsIcon({ size = 21, color = '#5c6a77' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8}>
      <Rect x={3} y={3} width={7} height={7} rx={2} />
      <Rect x={14} y={3} width={7} height={7} rx={2} />
      <Rect x={3} y={14} width={7} height={7} rx={2} />
      <Rect x={14} y={14} width={7} height={7} rx={2} />
    </Svg>
  );
}

export function TabMarketsIcon({ size = 21, color = '#5c6a77' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8}>
      <Path d="M8 2.5v3.5M8 18v3.5M16 2.5v3M16 15v6.5" />
      <Rect x={5} y={6} width={6} height={12} rx={2} />
      <Rect x={13} y={5} width={6} height={10} rx={2} />
    </Svg>
  );
}

export function TabInsightsIcon({ size = 21, color = '#5c6a77' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8}>
      <Circle cx={12} cy={12} r={9} />
      <Path d="M3 12h18M12 3c2.6 3 2.6 15 0 18M12 3c-2.6 3-2.6 15 0 18" />
    </Svg>
  );
}

export function TabPerfIcon({ size = 21, color = '#5c6a77' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8}>
      <Path d="M4 20V11M10.5 20V4M17 20v-6" />
    </Svg>
  );
}

export function TabProfileIcon({ size = 21, color = '#5c6a77' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8}>
      <Circle cx={12} cy={12} r={9} />
      <Circle cx={12} cy={10} r={3} />
      <Path d="M6.5 18.5c1.4-2.4 3.2-3.3 5.5-3.3s4.1.9 5.5 3.3" />
    </Svg>
  );
}

export function MiniBars({ color = '#C8FF4D' }: IconProps) {
  return (
    <Svg width={10} height={9} viewBox="0 0 10 9" fill="none">
      <Rect x={0} y={4} width={2.5} height={5} rx={1} fill={color} />
      <Rect x={3.75} y={2} width={2.5} height={7} rx={1} fill={color} />
      <Rect x={7.5} y={0} width={2.5} height={9} rx={1} fill={color} opacity={0.3} />
    </Svg>
  );
}
