import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';
import { PositionRowVM } from '../engine/rows';

interface Props {
  row: PositionRowVM;
  onChart?: () => void;
  onClose?: () => void;
}

export function PositionCard({ row, onChart, onClose }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.symWrap}>
          <View style={[styles.mark, { backgroundColor: row.tint }]}>
            <Text style={styles.markText}>{row.mark}</Text>
          </View>
          <Text style={styles.sym}>{row.sym}</Text>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{row.tag}</Text>
          </View>
        </View>
        <Text style={[styles.pnl, { color: row.pnlColor }]}>{row.pnl}</Text>
      </View>
      <View style={styles.midRow}>
        <Text style={styles.sideLine}>
          <Text style={[styles.side, { color: row.sideColor }]}>{row.side}</Text>
          <Text style={styles.detail}> {row.detail}</Text>
        </Text>
        <Text style={styles.now}>{row.now}</Text>
      </View>
      {row.live ? (
        <View style={styles.actions}>
          <Pressable style={styles.chartBtn} onPress={onChart}>
            <Text style={styles.chartBtnText}>Chart</Text>
          </Pressable>
          <Pressable style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Close position</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderHairline,
    padding: 13,
    paddingHorizontal: 14,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  symWrap: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  mark: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  markText: { fontFamily: fontFamily.displayBold, fontSize: 11, color: colors.bg },
  sym: { fontFamily: fontFamily.display, fontSize: 15, color: colors.textPrimary },
  tag: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5, backgroundColor: colors.whiteWash07 },
  tagText: { fontSize: 10, fontWeight: '600', color: colors.textSubtle },
  pnl: { fontFamily: fontFamily.display, fontSize: 14.5, fontWeight: '600' },
  midRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 7 },
  sideLine: { fontSize: 12.5 },
  side: { fontWeight: '600' },
  detail: { color: colors.textFaint },
  now: { fontSize: 12.5, color: colors.textFaint },
  actions: { flexDirection: 'row', gap: 9, marginTop: 12 },
  chartBtn: { flex: 1, height: 34, borderRadius: 10, backgroundColor: colors.whiteWash06, alignItems: 'center', justifyContent: 'center' },
  chartBtnText: { fontSize: 12.5, fontWeight: '600', color: colors.textBody },
  closeBtn: { flex: 1, height: 34, borderRadius: 10, backgroundColor: colors.downSoftest, alignItems: 'center', justifyContent: 'center' },
  closeBtnText: { fontSize: 12.5, fontWeight: '600', color: colors.downText },
});
