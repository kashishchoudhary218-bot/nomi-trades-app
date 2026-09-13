import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';
import { useTradingStore } from '../store/useTradingStore';
import { fmt } from '../engine/format';
import { equityForAccount, openPlForAccount } from '../engine/selectors';
import { closedPositionRows, openPositionRows } from '../engine/rows';
import { AccountCard } from '../components/AccountCard';
import { PositionCard } from '../components/PositionCard';
import { BellIcon, ClockIcon } from '../components/Icons';
import { IconButton } from '../components/IconButton';
import { PositionTab } from '../types';

export function AccountsScreen() {
  const insets = useSafeAreaInsets();
  const st = useTradingStore();
  const openTerminal = useTradingStore((s) => s.openTerminal);
  const closePosition = useTradingStore((s) => s.closePosition);
  const restoreAccount = useTradingStore((s) => s.restoreAccount);
  const emailStatement = useTradingStore((s) => s.emailStatement);

  const visibleAccounts = st.accounts.filter((a) => !a.archived && a.mode === st.accMode);
  const archivedAccounts = st.accounts.filter((a) => a.archived);
  const selectedAccount = st.accounts.find((a) => a.id === st.selAcc) ?? st.accounts[0];

  const totalEquity = st.accounts.filter((a) => !a.archived).reduce((t, a) => t + equityForAccount(a, st.positions, st.px), 0);
  const dayBase = st.accounts.reduce((t, a) => t + a.bal, 0);
  const dayDelta = st.accounts.filter((a) => !a.archived).reduce((t, a) => t + openPlForAccount(st.positions, st.px, a.id), 0);
  const dayPctNum = dayBase ? (dayDelta / dayBase) * 100 : 0;
  const dayUp = dayPctNum >= 0;

  const openRows = useMemo(
    () => openPositionRows(st.positions, st.px, selectedAccount.id, selectedAccount.curr),
    [st.positions, st.px, selectedAccount.id, selectedAccount.curr]
  );
  const closedRows = useMemo(
    () => closedPositionRows(st.closed, selectedAccount.id, selectedAccount.curr),
    [st.closed, selectedAccount.id, selectedAccount.curr]
  );
  const rows = st.posTab === 'open' ? openRows : st.posTab === 'closed' ? closedRows : [];

  const emptyTitle = st.posTab === 'pending' ? 'No pending orders' : st.posTab === 'open' ? 'No open positions' : 'No closed trades';
  const emptyBody =
    st.posTab === 'pending'
      ? 'Set a limit order from any instrument and it will queue up in this tab.'
      : 'Open a position from Markets or the terminal to see it here.';

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 8 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerRow}>
        <View style={styles.brandRow}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>N</Text>
          </View>
          <Text style={styles.brandText}>NOMI TRADES</Text>
        </View>
        <View style={styles.headerIcons}>
          <IconButton>
            <ClockIcon />
          </IconButton>
          <IconButton badge>
            <BellIcon />
          </IconButton>
        </View>
      </View>

      <View style={styles.equityRow}>
        <View>
          <Text style={styles.equityLabel}>TOTAL EQUITY</Text>
          <Text style={styles.equityValue}>₹ {fmt(totalEquity)}</Text>
        </View>
        <View style={[styles.dayPill, { backgroundColor: dayUp ? colors.upSoft : colors.downSofter }]}>
          <Text style={{ color: dayUp ? colors.up : colors.down, fontSize: 12.5, fontWeight: '600' }}>
            {(dayUp ? '+' : '') + dayPctNum.toFixed(2) + '% open P/L'}
          </Text>
        </View>
      </View>

      <View style={styles.modeToggle}>
        {(['Real', 'Demo'] as const).map((m) => {
          const count = st.accounts.filter((a) => !a.archived && a.mode === m).length;
          const active = st.accMode === m;
          return (
            <Pressable key={m} style={[styles.modeItem, { backgroundColor: active ? colors.accentSofter : 'transparent' }]} onPress={() => st.setAccMode(m)}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: active ? colors.accent : colors.textMuted }}>{m}</Text>
              <Text style={styles.modeCount}>{count}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={{ gap: 12 }}>
        {visibleAccounts.map((a) => (
          <AccountCard key={a.id} account={a} selected={a.id === st.selAcc} positions={st.positions} px={st.px} />
        ))}
      </View>

      {archivedAccounts.length > 0 ? (
        <View>
          <Text style={styles.sectionLabel}>ARCHIVED</Text>
          <View style={{ gap: 10 }}>
            {archivedAccounts.map((a) => (
              <View key={a.id} style={styles.archivedCard}>
                <View style={styles.archivedTop}>
                  <View>
                    <Text style={styles.archivedLabel}>
                      {a.label} · <Text style={{ color: colors.textDimmer }}>#{a.num}</Text>
                    </Text>
                    <Text style={styles.archivedBal}>
                      {fmt(a.bal)} {a.curr}
                    </Text>
                  </View>
                  <View style={styles.archivedModeBadge}>
                    <Text style={styles.archivedModeText}>{a.mode}</Text>
                  </View>
                </View>
                <View style={styles.archivedActions}>
                  <Pressable style={styles.restoreBtn} onPress={() => restoreAccount(a.id)}>
                    <Text style={styles.restoreBtnText}>Restore</Text>
                  </Pressable>
                  <Pressable style={styles.statementBtn} onPress={() => emailStatement(a.id)}>
                    <Text style={styles.statementBtnText}>Statements</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      <View>
        <View style={styles.posTabsRow}>
          {(['open', 'pending', 'closed'] as PositionTab[]).map((tab) => {
            const active = st.posTab === tab;
            return (
              <Pressable key={tab} onPress={() => st.setPosTab(tab)} style={[styles.posTab, { borderBottomColor: active ? colors.accent : 'transparent' }]}>
                <Text style={[styles.posTabText, { color: active ? colors.textPrimary : colors.textDim }]}>
                  {tab[0].toUpperCase() + tab.slice(1)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {rows.length > 0 ? (
          <View style={{ gap: 10, paddingTop: 14 }}>
            {rows.map((row) => (
              <PositionCard
                key={row.id}
                row={row}
                onChart={() => openTerminal(row.sym)}
                onClose={() => closePosition(row.id)}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>{emptyTitle}</Text>
            <Text style={styles.emptyBody}>{emptyBody}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 20, paddingBottom: 24, gap: 18 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  logo: { width: 26, height: 26, borderRadius: 8, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  logoText: { fontFamily: fontFamily.displayBold, fontSize: 14, color: colors.bg },
  brandText: { fontFamily: fontFamily.display, fontSize: 13, fontWeight: '600', letterSpacing: 2.4, color: colors.textHigh },
  headerIcons: { flexDirection: 'row', gap: 8 },
  equityRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  equityLabel: { fontSize: 11, letterSpacing: 1.6, color: colors.textDim, fontWeight: '600' },
  equityValue: { fontFamily: fontFamily.display, fontSize: 34, fontWeight: '700', color: colors.textPrimary, letterSpacing: -0.8, marginTop: 4 },
  dayPill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  modeToggle: { flexDirection: 'row', gap: 6, padding: 4, borderRadius: 13, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.borderHairline2 },
  modeItem: { flex: 1, height: 34, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  modeCount: { fontSize: 11, color: colors.textDim },
  sectionLabel: { fontSize: 11, letterSpacing: 1.6, color: colors.textDim, fontWeight: '600', paddingBottom: 10 },
  archivedCard: { borderRadius: 16, backgroundColor: colors.cardAlt, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.whiteWash09, padding: 14 },
  archivedTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  archivedLabel: { fontSize: 12.5, color: colors.textFaint },
  archivedBal: { fontFamily: fontFamily.display, fontSize: 16, fontWeight: '600', color: '#a8b4c0', marginTop: 5 },
  archivedModeBadge: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 7, backgroundColor: colors.whiteWash06 },
  archivedModeText: { fontSize: 11, fontWeight: '600', color: colors.textMuted },
  archivedActions: { flexDirection: 'row', gap: 9, marginTop: 13 },
  restoreBtn: { flex: 1, height: 36, borderRadius: 10, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  restoreBtnText: { fontSize: 12.5, fontWeight: '600', color: colors.accent },
  statementBtn: { flex: 1, height: 36, borderRadius: 10, backgroundColor: colors.whiteWash06, alignItems: 'center', justifyContent: 'center' },
  statementBtnText: { fontSize: 12.5, fontWeight: '600', color: colors.textBody },
  posTabsRow: { flexDirection: 'row', alignItems: 'center', gap: 22, borderBottomWidth: 1, borderBottomColor: colors.borderHairline3 },
  posTab: { paddingBottom: 10, borderBottomWidth: 2 },
  posTabText: { fontSize: 14, fontWeight: '600' },
  emptyWrap: { paddingVertical: 52, paddingHorizontal: 24, alignItems: 'center' },
  emptyTitle: { fontFamily: fontFamily.display, fontSize: 16, fontWeight: '600', color: colors.textMid },
  emptyBody: { fontSize: 13, color: colors.textDim, marginTop: 7, lineHeight: 19.5, textAlign: 'center' },
});
