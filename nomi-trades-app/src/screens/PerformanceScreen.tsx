import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Line, Path, Rect } from 'react-native-svg';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';
import { useTradingStore } from '../store/useTradingStore';
import { computePerformance } from '../engine/performance';
import { PerfPeriod, PerfTab } from '../types';

const PERIODS: PerfPeriod[] = ['7 days', '30 days', '90 days', '365 days'];
const CHART_TABS: PerfTab[] = ['Net Profit', 'Closed Orders', 'Trading Volume', 'Equity'];

export function PerformanceScreen() {
  const insets = useSafeAreaInsets();
  const st = useTradingStore();
  const setPerfTab = useTradingStore((s) => s.setPerfTab);
  const setPerfPeriod = useTradingStore((s) => s.setPerfPeriod);
  const selectAccount = useTradingStore((s) => s.selectAccount);
  const setAccMode = useTradingStore((s) => s.setAccMode);

  const selectedAccount = st.accounts.find((a) => a.id === st.selAcc) ?? st.accounts[0];
  const nonArchived = st.accounts.filter((a) => !a.archived);

  const perf = useMemo(
    () => computePerformance(selectedAccount, st.positions, st.closed, st.perfTab, st.perfPeriod, st.px),
    [selectedAccount, st.positions, st.closed, st.perfTab, st.perfPeriod, st.px]
  );

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingTop: insets.top + 8 }]} showsVerticalScrollIndicator={false}>
      <Text style={styles.heading}>Performance</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {nonArchived.map((a) => {
          const active = a.id === st.selAcc;
          return (
            <Pressable
              key={a.id}
              onPress={() => {
                selectAccount(a.id);
                setAccMode(a.mode);
              }}
              style={[styles.accChip, { backgroundColor: active ? colors.accentSoft : colors.card, borderColor: active ? colors.accentBorder : colors.borderHairline2 }]}
            >
              <Text style={{ fontSize: 12.5, fontWeight: '600', color: active ? colors.accent : colors.textBody }}>{a.label}</Text>
              <Text style={styles.accChipNum}>#{a.num}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.periodsRow}>
        {PERIODS.map((p) => {
          const active = st.perfPeriod === p;
          return (
            <Pressable key={p} onPress={() => setPerfPeriod(p)} style={[styles.periodItem, { backgroundColor: active ? colors.accentSofter : colors.whiteWash06 }]}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: active ? colors.accent : colors.textMuted }}>{p}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <View>
            <Text style={styles.chartLabel}>{perf.chartLabel}</Text>
            <Text style={[styles.chartValue, { color: perf.chartColor }]}>{perf.chartValue}</Text>
          </View>
          <Text style={styles.chartSub}>{perf.chartSub}</Text>
        </View>

        <Svg viewBox="0 0 320 130" width="100%" height={130} fill="none" style={{ marginTop: 12 }}>
          <Line x1={0} y1={32} x2={320} y2={32} stroke={colors.divider} strokeWidth={1} />
          <Line x1={0} y1={65} x2={320} y2={65} stroke={colors.divider} strokeWidth={1} />
          <Line x1={0} y1={98} x2={320} y2={98} stroke={colors.divider} strokeWidth={1} />
          {perf.chartIsBars
            ? perf.chartBars.map((b, i) => <Rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx={3} fill={b.fill} />)
            : null}
          {perf.chartIsLine ? (
            <>
              <Path d={perf.chartArea} fill={perf.chartFill} />
              <Path d={perf.chartLine} stroke={perf.chartColor} strokeWidth={2.2} strokeLinecap="round" />
            </>
          ) : null}
        </Svg>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chartTabsRow}>
          {CHART_TABS.map((t) => {
            const active = st.perfTab === t;
            return (
              <Pressable key={t} onPress={() => setPerfTab(t)} style={[styles.chartTab, { backgroundColor: active ? colors.accentSofter : colors.whiteWash06 }]}>
                <Text style={{ fontSize: 11.5, fontWeight: '600', color: active ? colors.accent : colors.textMuted }}>{t}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.summaryGrid}>
        {perf.summaryCards.map((s) => (
          <View key={s.label} style={styles.summaryCard}>
            <Text style={styles.summaryCardLabel}>{s.label}</Text>
            <Text style={[styles.summaryCardValue, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.summaryCardNote}>{s.note}</Text>
          </View>
        ))}
      </View>

      <View style={styles.summaryList}>
        <Text style={styles.summaryListTitle}>ACCOUNT SUMMARY</Text>
        {perf.summaryRows.map((r, idx) => (
          <View key={r.label} style={[styles.summaryRow, idx > 0 && styles.summaryRowBorder]}>
            <Text style={styles.summaryRowLabel}>{r.label}</Text>
            <Text style={[styles.summaryRowValue, { color: r.color }]}>{r.value}</Text>
          </View>
        ))}
      </View>

      <View style={styles.winRateCard}>
        <Text style={styles.winRateTitle}>WIN RATE BY INSTRUMENT</Text>
        <View style={{ gap: 13, marginTop: 14 }}>
          {perf.winRates.map((w) => (
            <View key={w.sym}>
              <View style={styles.winRateHeader}>
                <Text style={styles.winRateSym}>{w.sym}</Text>
                <Text style={styles.winRatePct}>{w.pct}</Text>
              </View>
              <View style={styles.winRateTrack}>
                <View style={[styles.winRateFill, { backgroundColor: w.color, width: w.pct as `${number}%` }]} />
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
  content: { paddingHorizontal: 20, paddingBottom: 24, gap: 16 },
  heading: { fontFamily: fontFamily.display, fontSize: 26, fontWeight: '700', color: colors.textPrimary, letterSpacing: -0.5 },
  accChip: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1 },
  accChipNum: { fontSize: 11, color: colors.textDim },
  periodsRow: { flexDirection: 'row', gap: 7 },
  periodItem: { flex: 1, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  chartCard: { borderRadius: 20, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.borderHairline, padding: 16 },
  chartHeader: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  chartLabel: { fontSize: 11, letterSpacing: 1.4, color: colors.textDim, fontWeight: '600' },
  chartValue: { fontFamily: fontFamily.display, fontSize: 27, fontWeight: '700', marginTop: 5, letterSpacing: -0.5 },
  chartSub: { fontSize: 11.5, color: colors.textDim, textAlign: 'right' },
  chartTabsRow: { gap: 6, marginTop: 8 },
  chartTab: { paddingHorizontal: 11, height: 30, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  summaryCard: { width: '48.4%', borderRadius: 16, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.borderHairline, padding: 14 },
  summaryCardLabel: { fontSize: 10.5, letterSpacing: 1.2, color: colors.textDim, fontWeight: '600' },
  summaryCardValue: { fontFamily: fontFamily.display, fontSize: 19, fontWeight: '700', marginTop: 7, letterSpacing: -0.3 },
  summaryCardNote: { fontSize: 11.5, color: colors.textDim, marginTop: 3 },
  summaryList: { borderRadius: 20, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.borderHairline, overflow: 'hidden' },
  summaryListTitle: { fontSize: 11, letterSpacing: 1.4, color: colors.textDim, fontWeight: '600', padding: 16, paddingBottom: 4 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, paddingHorizontal: 16 },
  summaryRowBorder: { borderTopWidth: 1, borderTopColor: colors.divider },
  summaryRowLabel: { fontSize: 13, color: colors.textMuted },
  summaryRowValue: { fontFamily: fontFamily.display, fontSize: 13.5, fontWeight: '600' },
  winRateCard: { borderRadius: 20, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.borderHairline, padding: 16 },
  winRateTitle: { fontSize: 11, letterSpacing: 1.4, color: colors.textDim, fontWeight: '600' },
  winRateHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  winRateSym: { fontFamily: fontFamily.display, fontSize: 13.5, fontWeight: '600', color: colors.textHigh },
  winRatePct: { fontSize: 12.5, fontWeight: '600', color: colors.textBody },
  winRateTrack: { height: 6, borderRadius: 999, backgroundColor: colors.whiteWash07, marginTop: 7, overflow: 'hidden' },
  winRateFill: { height: '100%', borderRadius: 999 },
});
