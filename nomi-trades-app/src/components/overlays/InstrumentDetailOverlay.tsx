import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { useTradingStore } from '../../store/useTradingStore';
import { findInstrument } from '../../data/instruments';
import { bidAsk, changePct, priceOf } from '../../engine/selectors';
import { detailChartData } from '../../engine/charts';
import { ChevronLeftIcon, StarIcon, CandlesIcon } from '../Icons';
import { DetailTimeframe } from '../../types';

const TIMEFRAMES: DetailTimeframe[] = ['5M', '1H', '4H', '1D', '1W'];

export function InstrumentDetailOverlay() {
  const insets = useSafeAreaInsets();
  const st = useTradingStore();
  const closeDetail = useTradingStore((s) => s.closeDetail);
  const setDetailTf = useTradingStore((s) => s.setDetailTf);
  const openTerminal = useTradingStore((s) => s.openTerminal);
  const openTicket = useTradingStore((s) => s.openTicket);

  const sym = st.detailSym;
  const chartSym = sym ?? st.tSym;
  const chart = useMemo(() => detailChartData(chartSym, st.px), [chartSym, st.px]);

  if (!sym) return null;

  const inst = findInstrument(sym);
  const pct = changePct(st.px, sym);
  const up = pct >= 0;
  const { bid, ask } = bidAsk(st.px, sym);

  const stats = [
    { label: 'SPREAD', value: (inst.p0 * 0.00012).toFixed(inst.dec) },
    { label: 'LEVERAGE', value: '1:200' },
    { label: 'DAY RANGE', value: (inst.p0 * 0.991).toFixed(inst.dec) + ' – ' + (inst.p0 * 1.008).toFixed(inst.dec) },
    { label: 'SWAP LONG', value: '-0.42' },
  ];

  return (
    <View style={styles.overlay}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable style={styles.iconBtn} onPress={closeDetail}>
          <ChevronLeftIcon />
        </Pressable>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.title}>{inst.sym}</Text>
          <Text style={styles.subtitle}>{inst.desc}</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 7 }}>
          <Pressable style={styles.iconBtn} onPress={() => openTerminal(sym)}>
            <CandlesIcon />
          </Pressable>
          <View style={styles.iconBtn}>
            <StarIcon />
          </View>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{priceOf(st.px, sym)}</Text>
          <Text style={{ fontSize: 13.5, fontWeight: '600', color: up ? colors.up : colors.down, paddingBottom: 6 }}>
            {(up ? '↑ ' : '↓ ') + Math.abs(pct).toFixed(2) + '%'}
          </Text>
        </View>

        <Svg viewBox="0 0 320 170" width="100%" height={170} fill="none" style={{ marginTop: 14 }}>
          <Path d={chart.area} fill={up ? colors.upSofter : colors.downSofter} />
          <Path d={chart.line} stroke={up ? colors.up : colors.down} strokeWidth={2.2} strokeLinecap="round" />
        </Svg>

        <View style={styles.tfRow}>
          {TIMEFRAMES.map((t) => {
            const active = st.detailTf === t;
            return (
              <Pressable key={t} onPress={() => setDetailTf(t)} style={[styles.tfChip, { backgroundColor: active ? colors.accentSofter : colors.whiteWash06 }]}>
                <Text style={{ fontSize: 12, fontWeight: '600', color: active ? colors.accent : colors.textMuted }}>{t}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.statsGrid}>
          {stats.map((d) => (
            <View key={d.label} style={styles.statCard}>
              <Text style={styles.statLabel}>{d.label}</Text>
              <Text style={styles.statValue}>{d.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sentimentCard}>
          <Text style={styles.sentimentLabel}>SENTIMENT · NOMI CLIENTS</Text>
          <View style={styles.sentimentBar}>
            <View style={{ width: '64%', backgroundColor: colors.up }} />
            <View style={{ width: '36%', backgroundColor: colors.down }} />
          </View>
          <View style={styles.sentimentFooter}>
            <Text style={{ color: colors.up, fontSize: 12, fontWeight: '600' }}>64% long</Text>
            <Text style={{ color: colors.down, fontSize: 12, fontWeight: '600' }}>36% short</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(20, insets.bottom + 10) }]}>
        <Pressable style={styles.sellBtn} onPress={() => openTicket('Sell', sym)}>
          <Text style={styles.sellLabel}>SELL</Text>
          <Text style={styles.ctaValue}>{bid.toFixed(inst.dec)}</Text>
        </Pressable>
        <Pressable style={styles.buyBtn} onPress={() => openTicket('Buy', sym)}>
          <Text style={styles.buyLabel}>BUY</Text>
          <Text style={styles.ctaValue}>{ask.toFixed(inst.dec)}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.bg, zIndex: 15 },
  header: { paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.chip, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fontFamily.display, fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  subtitle: { fontSize: 11.5, color: colors.textDim, marginTop: 2 },
  body: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 20 },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 11 },
  price: { fontFamily: fontFamily.display, fontSize: 33, fontWeight: '700', color: colors.textPrimary, letterSpacing: -1 },
  tfRow: { flexDirection: 'row', gap: 7, marginTop: 8 },
  tfChip: { flex: 1, height: 31, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 18 },
  statCard: { width: '48.4%', borderRadius: 14, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.borderHairline, padding: 12, paddingHorizontal: 13 },
  statLabel: { fontSize: 10.5, letterSpacing: 1.2, color: colors.textDim, fontWeight: '600' },
  statValue: { fontFamily: fontFamily.display, fontSize: 15, fontWeight: '600', color: colors.textHigh, marginTop: 6 },
  sentimentCard: { marginTop: 18, borderRadius: 16, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.borderHairline, padding: 15 },
  sentimentLabel: { fontSize: 11, letterSpacing: 1.4, color: colors.textDim, fontWeight: '600' },
  sentimentBar: { flexDirection: 'row', height: 8, borderRadius: 999, overflow: 'hidden', marginTop: 12 },
  sentimentFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 9 },
  footer: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, paddingTop: 12, backgroundColor: '#0E141B', borderTopWidth: 1, borderTopColor: colors.borderHairline2 },
  sellBtn: { flex: 1, height: 52, borderRadius: 15, backgroundColor: colors.downSoftest, borderWidth: 1, borderColor: colors.downBorder28, alignItems: 'center', justifyContent: 'center' },
  buyBtn: { flex: 1, height: 52, borderRadius: 15, backgroundColor: colors.upSoftest, borderWidth: 1, borderColor: colors.upBorder, alignItems: 'center', justifyContent: 'center' },
  sellLabel: { fontSize: 11, color: colors.downText, letterSpacing: 0.8, fontWeight: '600' },
  buyLabel: { fontSize: 11, color: colors.up, letterSpacing: 0.8, fontWeight: '600' },
  ctaValue: { fontFamily: fontFamily.display, fontSize: 15, fontWeight: '700', color: colors.textPrimary },
});
