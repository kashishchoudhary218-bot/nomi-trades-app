import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';
import { useTradingStore } from '../store/useTradingStore';
import { INSTRUMENTS, MARKET_CATEGORIES } from '../data/instruments';
import { changePct, priceOf } from '../engine/selectors';
import { instrumentSparkPath } from '../engine/charts';
import { InstrumentRow } from '../components/InstrumentRow';
import { CandlesIcon, ChevronDownIcon, EditIcon, SearchIcon } from '../components/Icons';
import { fmt } from '../engine/format';

export function MarketsScreen() {
  const insets = useSafeAreaInsets();
  const st = useTradingStore();
  const openTerminal = useTradingStore((s) => s.openTerminal);
  const openDetail = useTradingStore((s) => s.openDetail);
  const setCategory = useTradingStore((s) => s.setCategory);

  const selectedAccount = st.accounts.find((a) => a.id === st.selAcc) ?? st.accounts[0];
  const list = st.cat === 'Favourites' ? INSTRUMENTS : INSTRUMENTS.filter((b) => b.cat === st.cat);

  const rows = useMemo(
    () =>
      list.map((instrument, k) => {
        const pct = changePct(st.px, instrument.sym);
        const up = pct >= 0;
        const spark = instrumentSparkPath(k, instrument.sym, st.px);
        return {
          instrument,
          price: priceOf(st.px, instrument.sym),
          chg: (up ? '↑ ' : '↓ ') + Math.abs(pct).toFixed(2) + '%',
          ...spark,
        };
      }),
    [list, st.px]
  );

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingTop: insets.top + 8 }]} showsVerticalScrollIndicator={false}>
      <View style={styles.balanceWrap}>
        <Pressable style={styles.balancePill} onPress={() => openTerminal()}>
          <View style={[styles.modeChip, { backgroundColor: selectedAccount.mode === 'Demo' ? colors.whiteWash08 : colors.upSofter }]}>
            <Text style={{ fontSize: 11.5, fontWeight: '600', color: selectedAccount.mode === 'Demo' ? colors.textSubtle : colors.up }}>{selectedAccount.mode}</Text>
          </View>
          <Text style={styles.balanceText}>₹ {fmt(selectedAccount.bal)}</Text>
          <ChevronDownIcon size={15} color={colors.textFaint} />
        </Pressable>
      </View>

      <View style={styles.headingRow}>
        <Text style={styles.heading}>Markets</Text>
        <View style={styles.headingIcons}>
          <Pressable style={styles.iconCircle} onPress={() => openTerminal()}>
            <CandlesIcon />
          </Pressable>
          <View style={styles.iconCircle}>
            <SearchIcon />
          </View>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catsScroll} contentContainerStyle={styles.catsContent}>
        {MARKET_CATEGORIES.map((c) => {
          const active = st.cat === c;
          return (
            <Pressable key={c} onPress={() => setCategory(c)} style={[styles.catTab, { borderBottomColor: active ? colors.accent : 'transparent' }]}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: active ? colors.textPrimary : colors.textDim }}>{c}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.sortRow}>
        <View style={styles.sortChip}>
          <Text style={styles.sortChipText}>Sort by volume</Text>
          <ChevronDownIcon />
        </View>
        <View style={styles.sortChip}>
          <Text style={styles.sortChipText}>Edit</Text>
          <EditIcon />
        </View>
      </View>

      <View style={{ gap: 9, paddingHorizontal: 20 }}>
        {rows.map((row) => (
          <InstrumentRow
            key={row.instrument.sym}
            instrument={row.instrument}
            price={row.price}
            chg={row.chg}
            path={row.path}
            stroke={row.stroke}
            onPress={() => openDetail(row.instrument.sym)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingBottom: 24, gap: 14 },
  balanceWrap: { alignItems: 'center' },
  balancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingVertical: 6,
    paddingLeft: 6,
    paddingRight: 8,
    borderRadius: 999,
    backgroundColor: colors.chip,
    borderWidth: 1,
    borderColor: colors.borderHairline3,
  },
  modeChip: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 999 },
  balanceText: { fontFamily: fontFamily.display, fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  headingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  heading: { fontFamily: fontFamily.display, fontSize: 26, fontWeight: '700', color: colors.textPrimary, letterSpacing: -0.5 },
  headingIcons: { flexDirection: 'row', gap: 8 },
  iconCircle: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.chip, alignItems: 'center', justifyContent: 'center' },
  catsScroll: { flexGrow: 0, borderBottomWidth: 1, borderBottomColor: colors.borderHairline3 },
  catsContent: { gap: 20, paddingHorizontal: 20 },
  catTab: { paddingBottom: 10, borderBottomWidth: 2 },
  sortRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 20 },
  sortChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, backgroundColor: colors.chip },
  sortChipText: { fontSize: 12.5, color: colors.textBody },
});
