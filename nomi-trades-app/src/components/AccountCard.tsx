import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';
import { Account } from '../types';
import { fmt } from '../engine/format';
import { equityForAccount, openPlForAccount } from '../engine/selectors';
import { DepositIcon, MoreDotsIcon, WithdrawIcon, ChevronRightIcon, TradeGlyphIcon } from './Icons';
import { useTradingStore } from '../store/useTradingStore';

interface Props {
  account: Account;
  selected: boolean;
  positions: import('../types').Position[];
  px: Record<string, number>;
}

export function AccountCard({ account, selected, positions, px }: Props) {
  const selectAccount = useTradingStore((s) => s.selectAccount);
  const tradeAccount = useTradingStore((s) => s.tradeAccount);
  const fundAccount = useTradingStore((s) => s.fundAccount);
  const secondaryAccountAction = useTradingStore((s) => s.secondaryAccountAction);
  const moreAccount = useTradingStore((s) => s.moreAccount);

  const demo = account.mode === 'Demo';
  const openPl = openPlForAccount(positions, px, account.id);
  const equity = equityForAccount(account, positions, px);

  return (
    <View style={[styles.card, { borderColor: selected ? colors.accentBorder : colors.borderHairline2 }]}>
      <Pressable style={styles.headerRow} onPress={() => selectAccount(account.id)}>
        <Text style={styles.headerLabel}>
          {account.label} · <Text style={styles.headerNum}>#{account.num}</Text>
        </Text>
        <View style={styles.headerRight}>
          <Text style={[styles.selLabel, { color: selected ? colors.accent : colors.textDim }]}>{selected ? 'Selected' : 'Select'}</Text>
          <ChevronRightIcon color={colors.textFaint} />
        </View>
      </Pressable>

      <View style={styles.badgeRow}>
        <View style={[styles.badge, { backgroundColor: 'rgba(53,209,154,.12)' }]}>
          <Text style={[styles.badgeText, { color: colors.up }]}>MT5</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: 'rgba(53,209,154,.12)' }]}>
          <Text style={[styles.badgeText, { color: colors.up }]}>{account.type}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: demo ? colors.whiteWash07 : 'rgba(127,168,255,.14)' }]}>
          <Text style={[styles.badgeText, { color: demo ? colors.textSubtle : colors.blue }]}>{account.mode}</Text>
        </View>
      </View>

      <View style={styles.balRow}>
        <Text style={styles.balValue}>{fmt(account.bal)}</Text>
        <Text style={styles.balCurr}>{account.curr}</Text>
      </View>
      <Text style={styles.eqLine}>
        Equity {fmt(equity)} · Open P/L <Text style={{ color: openPl >= 0 ? colors.up : colors.down }}>{(openPl >= 0 ? '+' : '') + fmt(openPl)}</Text>
      </Text>

      <View style={styles.actionsRow}>
        <Pressable style={styles.action} onPress={() => tradeAccount(account.id)}>
          <View style={[styles.actionCircle, { backgroundColor: colors.accent }]}>
            <TradeGlyphIcon />
          </View>
          <Text style={styles.actionLabel}>Trade</Text>
        </Pressable>
        <Pressable style={styles.action} onPress={() => fundAccount(account.id)}>
          <View style={styles.actionCircleDark}>
            <DepositIcon />
          </View>
          <Text style={styles.actionLabelMuted}>{demo ? 'Set balance' : 'Deposit'}</Text>
        </Pressable>
        <Pressable style={styles.action} onPress={() => secondaryAccountAction(account.id)}>
          <View style={styles.actionCircleDark}>
            <WithdrawIcon />
          </View>
          <Text style={styles.actionLabelMuted}>{demo ? 'Reset' : 'Withdraw'}</Text>
        </Pressable>
        <Pressable style={styles.action} onPress={() => moreAccount(account.id)}>
          <View style={styles.actionCircleDark}>
            <MoreDotsIcon />
          </View>
          <Text style={styles.actionLabelMuted}>More</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    padding: 16,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLabel: { fontSize: 12.5, color: colors.textFaint, letterSpacing: 0.4 },
  headerNum: { color: colors.textDimmer },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  selLabel: { fontSize: 11, fontWeight: '600' },
  badgeRow: { flexDirection: 'row', gap: 7, marginTop: 11, flexWrap: 'wrap' },
  badge: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 7 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  balRow: { flexDirection: 'row', alignItems: 'baseline', gap: 7, marginTop: 12 },
  balValue: { fontFamily: fontFamily.display, fontSize: 26, fontWeight: '700', color: colors.textPrimary, letterSpacing: -0.5 },
  balCurr: { fontSize: 13, fontWeight: '600', color: colors.textFaint },
  eqLine: { fontSize: 11.5, color: colors.textDim, marginTop: 4 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  action: { alignItems: 'center', gap: 7, width: 62 },
  actionCircle: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  actionCircleDark: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.chipAlt, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { fontSize: 12, color: colors.textCoolGray },
  actionLabelMuted: { fontSize: 12, color: colors.textMuted },
});
