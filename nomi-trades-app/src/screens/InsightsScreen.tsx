import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Line, Path } from 'react-native-svg';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';
import { useTradingStore } from '../store/useTradingStore';
import { INSTRUMENTS } from '../data/instruments';
import { changePct, priceOf } from '../engine/selectors';
import { deskSignals, moverSparkPath } from '../engine/charts';
import { ECONOMIC_EVENTS } from '../data/insights';
import { Sparkline } from '../components/charts/Sparkline';

export function InsightsScreen() {
  const insets = useSafeAreaInsets();
  const px = useTradingStore((s) => s.px);

  const movers = useMemo(
    () =>
      INSTRUMENTS.slice(0, 5).map((b, k) => {
        const pct = changePct(px, b.sym);
        const up = pct >= 0;
        const spark = moverSparkPath(k, b.sym, px);
        return {
          sym: b.sym.split('/')[0],
          mark: b.mark,
          tint: b.tint,
          price: priceOf(px, b.sym),
          chg: (up ? '↑ ' : '↓ ') + Math.abs(pct).toFixed(2) + '%',
          ...spark,
        };
      }),
    [px]
  );

  const signals = useMemo(() => deskSignals(), []);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingTop: insets.top + 8 }]} showsVerticalScrollIndicator={false}>
      <Text style={styles.heading}>Insights</Text>

      <View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>TOP MOVERS</Text>
          <Text style={styles.showAll}>Show all</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.moversRow}>
          {movers.map((m) => (
            <View key={m.sym} style={styles.moverCard}>
              <View style={styles.moverTop}>
                <View style={[styles.moverMark, { backgroundColor: m.tint }]}>
                  <Text style={styles.moverMarkText}>{m.mark}</Text>
                </View>
                <Text style={styles.moverSym}>{m.sym}</Text>
              </View>
              <View style={{ marginTop: 10 }}>
                <Sparkline path={m.path} stroke={m.stroke} width={106} height={28} />
              </View>
              <Text style={styles.moverPrice}>{m.price}</Text>
              <Text style={[styles.moverChg, { color: m.stroke }]}>{m.chg}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>DESK SIGNALS</Text>
          <Text style={styles.showAll}>Show all</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.signalsRow}>
          {signals.map((s) => (
            <View key={s.sym} style={styles.signalCard}>
              <View style={styles.signalHeader}>
                <Text style={styles.signalSym}>{s.sym}</Text>
                <Text style={styles.signalTf}>{s.tf}</Text>
              </View>
              <View style={styles.signalChartWrap}>
                <Svg viewBox="0 0 260 106" width="100%" height={106} preserveAspectRatio="none">
                  <Path d={s.band} fill={s.bandFill} />
                  <Path d={s.line} stroke={s.stroke} strokeWidth={2} fill="none" />
                  <Line x1={0} y1={s.tpY} x2={260} y2={s.tpY} stroke={colors.up} strokeWidth={1.4} strokeDasharray="5 4" />
                  <Line x1={0} y1={s.slY} x2={260} y2={s.slY} stroke={colors.down} strokeWidth={1.4} strokeDasharray="5 4" />
                </Svg>
              </View>
              <View style={styles.signalBody}>
                <Text style={styles.signalHead}>{s.head}</Text>
                <View style={styles.signalFooter}>
                  <View style={[styles.signalPill, { backgroundColor: s.pillBg }]}>
                    <Text style={{ color: s.stroke, fontSize: 11.5, fontWeight: '600' }}>{s.bias}</Text>
                  </View>
                  <Text style={styles.signalTime}>{s.time}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      <View>
        <Text style={[styles.sectionLabel, { paddingHorizontal: 20, paddingBottom: 11 }]}>ECONOMIC CALENDAR</Text>
        <View style={styles.calendarCard}>
          {ECONOMIC_EVENTS.map((e, idx) => (
            <View key={e.name} style={[styles.calendarRow, idx > 0 && styles.calendarRowBorder]}>
              <View style={[styles.calendarCc, { backgroundColor: e.tint }]}>
                <Text style={styles.calendarCcText}>{e.cc}</Text>
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.calendarName}>{e.name}</Text>
                <Text style={styles.calendarWhen}>{e.when}</Text>
              </View>
              <View style={styles.calendarBars}>
                <View style={[styles.calendarBar, { backgroundColor: e.i1 }]} />
                <View style={[styles.calendarBar, { backgroundColor: e.i2 }]} />
                <View style={[styles.calendarBar, { backgroundColor: e.i3 }]} />
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingBottom: 24, gap: 22 },
  heading: { fontFamily: fontFamily.display, fontSize: 26, fontWeight: '700', color: colors.textPrimary, paddingHorizontal: 20, letterSpacing: -0.5 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 11 },
  sectionLabel: { fontSize: 11, letterSpacing: 1.6, color: colors.textDim, fontWeight: '600' },
  showAll: { fontSize: 12.5, fontWeight: '600', color: colors.accent },
  moversRow: { gap: 10, paddingHorizontal: 20, paddingBottom: 4 },
  moverCard: { width: 132, padding: 13, borderRadius: 16, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.borderHairline },
  moverTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  moverMark: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  moverMarkText: { fontFamily: fontFamily.displayBold, fontSize: 10, color: colors.bg },
  moverSym: { fontFamily: fontFamily.display, fontSize: 13.5, fontWeight: '600', color: colors.textPrimary },
  moverPrice: { fontFamily: fontFamily.display, fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginTop: 8 },
  moverChg: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  signalsRow: { gap: 12, paddingHorizontal: 20, paddingBottom: 4 },
  signalCard: { width: 258, borderRadius: 18, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.borderHairline, overflow: 'hidden' },
  signalHeader: { paddingHorizontal: 14, paddingTop: 13, paddingBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  signalSym: { fontFamily: fontFamily.display, fontSize: 13.5, fontWeight: '600', color: colors.textPrimary },
  signalTf: { fontSize: 11, color: colors.textDim, letterSpacing: 0.6 },
  signalChartWrap: { height: 106, backgroundColor: colors.surfaceDark },
  signalBody: { padding: 14 },
  signalHead: { fontSize: 14, fontWeight: '600', color: colors.textHigh, lineHeight: 19.6 },
  signalFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  signalPill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  signalTime: { fontSize: 11.5, color: colors.textDim },
  calendarCard: { marginHorizontal: 20, borderRadius: 18, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.borderHairline, overflow: 'hidden' },
  calendarRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  calendarRowBorder: { borderTopWidth: 1, borderTopColor: colors.divider },
  calendarCc: { width: 34, height: 24, borderRadius: 5, alignItems: 'center', justifyContent: 'center' },
  calendarCcText: { fontSize: 10.5, fontWeight: '700', color: colors.bg, letterSpacing: 0.5 },
  calendarName: { fontSize: 13.5, fontWeight: '600', color: colors.textHigh },
  calendarWhen: { fontSize: 11.5, color: colors.textDim, marginTop: 2 },
  calendarBars: { flexDirection: 'row', gap: 2.5, alignItems: 'flex-end', height: 13 },
  calendarBar: { width: 3, height: 13, borderRadius: 1 },
});
