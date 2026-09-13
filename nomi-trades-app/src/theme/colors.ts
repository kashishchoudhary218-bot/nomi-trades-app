// Palette lifted 1:1 from the Claude Design prototype (Nomi Trades.dc.html).
// Do not restyle — these are the exact hex/rgba values used in the source design.

export const colors = {
  bg: '#0B0F14',
  bgOuter: '#07090c',
  card: '#121922',
  cardAlt: '#0F151D',
  surfaceDark: '#0E141B',
  chip: '#161D25',
  chipAlt: '#1A222C',

  accent: '#C8FF4D',
  accentSoft: 'rgba(200,255,77,.14)',
  accentSofter: 'rgba(200,255,77,.16)',
  accentBorder: 'rgba(200,255,77,.35)',

  up: '#35D19A',
  upSoft: 'rgba(53,209,154,.12)',
  upSofter: 'rgba(53,209,154,.14)',
  upSoftest: 'rgba(53,209,154,.16)',
  upBorder: 'rgba(53,209,154,.3)',
  upBorder28: 'rgba(53,209,154,.28)',

  down: '#FF5F56',
  downSoft: 'rgba(255,95,86,.09)',
  downSofter: 'rgba(255,95,86,.12)',
  downSoftest: 'rgba(255,95,86,.14)',
  downText: '#FF8A84',
  downBorder: 'rgba(255,95,86,.2)',
  downBorder28: 'rgba(255,95,86,.28)',

  blue: '#7FA8FF',
  gold: '#F0C75E',
  purple: '#A9B4F5',

  textPrimary: '#ffffff',
  textHigh: '#eaf0f5',
  textMid: '#dbe3ea',
  textBody: '#b6c2cd',
  textMuted: '#8d9aa6',
  textFaint: '#7d8b98',
  textDim: '#6d7c89',
  textDimmer: '#5c6a77',
  textSubtle: '#9aa7b3',
  textCoolGray: '#cfd8e0',

  borderHairline: 'rgba(255,255,255,.055)',
  borderHairline2: 'rgba(255,255,255,.06)',
  borderHairline3: 'rgba(255,255,255,.07)',
  divider: 'rgba(255,255,255,.05)',
  whiteWash06: 'rgba(255,255,255,.06)',
  whiteWash07: 'rgba(255,255,255,.07)',
  whiteWash08: 'rgba(255,255,255,.08)',
  whiteWash09: 'rgba(255,255,255,.09)',
  whiteWash12: 'rgba(255,255,255,.12)',
  whiteWash16: 'rgba(255,255,255,.16)',
  whiteWash22: 'rgba(255,255,255,.22)',

  overlayScrim: 'rgba(4,7,10,.6)',
  gridLine: 'rgba(255,255,255,.045)',
} as const;

export type AccentOption = '#C8FF4D' | '#35D19A' | '#7FA8FF' | '#F0C75E';
export const ACCENT_OPTIONS: AccentOption[] = ['#C8FF4D', '#35D19A', '#7FA8FF', '#F0C75E'];

export type CurrencyOption = 'INR' | 'USD' | 'AED';
export const CURRENCY_OPTIONS: CurrencyOption[] = ['INR', 'USD', 'AED'];
