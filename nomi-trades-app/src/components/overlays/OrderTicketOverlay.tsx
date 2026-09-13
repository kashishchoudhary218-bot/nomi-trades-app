import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { useTradingStore } from '../../store/useTradingStore';
import { findInstrument } from '../../data/instruments';
import { bidAsk, freeMarginForAccount, MARGIN_PER_LOT } from '../../engine/selectors';
import { fmt } from '../../engine/format';
import { MinusIcon, PlusIcon } from '../Icons';
import { OrderType } from '../../types';

const LOT_PRESETS = [0.01, 0.1, 0.5, 1.0];
const ORDER_TYPES: OrderType[] = ['Market', 'Limit'];

export function OrderTicketOverlay() {
  const insets = useSafeAreaInsets();
  const st = useTradingStore();
  const closeTicket = useTradingStore((s) => s.closeTicket);
  const setOrderType = useTradingStore((s) => s.setOrderType);
  const incLots = useTradingStore((s) => s.incLots);
  const decLots = useTradingStore((s) => s.decLots);
  const setLots = useTradingStore((s) => s.setLots);
  const confirmOrder = useTradingStore((s) => s.confirmOrder);

  const ticket = st.ticket;
  if (!ticket) return null;

  const account = st.accounts.find((a) => a.id === st.selAcc) ?? st.accounts[0];
  const inst = findInstrument(ticket.sym);
  const { bid, ask } = bidAsk(st.px, ticket.sym);
  const entryPrice = ticket.side === 'Buy' ? ask : bid;
  const reqMargin = st.lots * MARGIN_PER_LOT;
  const freeMargin = freeMarginForAccount(account, st.positions, st.px);
  const freeMarginAfter = freeMargin - reqMargin;
  const ctaColor = ticket.side === 'Buy' ? colors.up : colors.down;

  const rows = [
    { label: 'Entry price', value: entryPrice.toFixed(inst.dec), color: colors.textHigh },
    { label: 'Required margin', value: '₹ ' + fmt(reqMargin), color: reqMargin > freeMargin ? colors.down : colors.textHigh },
    { label: 'Free margin after', value: '₹ ' + fmt(freeMarginAfter), color: colors.textHigh },
    { label: 'Account', value: account.label + ' · ' + account.mode, color: colors.textMuted },
  ];

  return (
    <View style={styles.overlay}>
      <Pressable style={{ flex: 1 }} onPress={closeTicket} />
      <View style={[styles.sheet, { paddingBottom: Math.max(26, insets.bottom + 14) }]}>
        <View style={styles.grabber} />
        <View style={styles.headerRow}>
          <Text style={styles.title}>
            {ticket.side} {ticket.sym}
          </Text>
          <Text style={styles.accText}>
            {account.mode} · {account.label}
          </Text>
        </View>

        <View style={styles.orderTypeRow}>
          {ORDER_TYPES.map((o) => {
            const active = st.otype === o;
            return (
              <Pressable key={o} onPress={() => setOrderType(o)} style={[styles.orderTypeChip, { backgroundColor: active ? colors.accentSofter : colors.whiteWash06 }]}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: active ? colors.accent : colors.textMuted }}>{o}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.lotsCard}>
          <View style={styles.lotsRow}>
            <View>
              <Text style={styles.lotsLabel}>VOLUME (LOTS)</Text>
              <Text style={styles.lotsValue}>{st.lots.toFixed(2)}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 9 }}>
              <Pressable style={styles.stepperBtn} onPress={decLots}>
                <MinusIcon />
              </Pressable>
              <Pressable style={styles.stepperBtn} onPress={incLots}>
                <PlusIcon />
              </Pressable>
            </View>
          </View>
          <View style={styles.presetRow}>
            {LOT_PRESETS.map((v) => (
              <Pressable key={v} style={styles.presetChip} onPress={() => setLots(v)}>
                <Text style={styles.presetText}>{v.toFixed(2)}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={{ gap: 9, marginTop: 15 }}>
          {rows.map((r) => (
            <View key={r.label} style={styles.detailRow}>
              <Text style={styles.detailLabel}>{r.label}</Text>
              <Text style={[styles.detailValue, { color: r.color }]}>{r.value}</Text>
            </View>
          ))}
        </View>

        <Pressable style={[styles.confirmBtn, { backgroundColor: ctaColor }]} onPress={confirmOrder}>
          <Text style={styles.confirmText}>
            Confirm {ticket.side.toLowerCase()} · {st.lots.toFixed(2)} lot
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.overlayScrim, zIndex: 30, justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 26, borderTopRightRadius: 26, borderBottomLeftRadius: 41, borderBottomRightRadius: 41, backgroundColor: colors.card, borderTopWidth: 1, borderColor: colors.whiteWash08, padding: 20, paddingTop: 14 },
  grabber: { width: 38, height: 4, borderRadius: 999, backgroundColor: colors.whiteWash16, alignSelf: 'center', marginBottom: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontFamily: fontFamily.display, fontSize: 18, fontWeight: '600', color: colors.textPrimary },
  accText: { fontSize: 13, color: colors.textFaint },
  orderTypeRow: { flexDirection: 'row', gap: 8, marginTop: 16 },
  orderTypeChip: { flex: 1, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  lotsCard: { marginTop: 16, borderRadius: 14, backgroundColor: colors.surfaceDark, borderWidth: 1, borderColor: colors.whiteWash06, padding: 14 },
  lotsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  lotsLabel: { fontSize: 11, letterSpacing: 1.2, color: colors.textDim, fontWeight: '600' },
  lotsValue: { fontFamily: fontFamily.display, fontSize: 24, fontWeight: '700', color: colors.textPrimary, marginTop: 5 },
  stepperBtn: { width: 42, height: 42, borderRadius: 12, backgroundColor: colors.chipAlt, alignItems: 'center', justifyContent: 'center' },
  presetRow: { flexDirection: 'row', gap: 7, marginTop: 13 },
  presetChip: { flex: 1, height: 30, borderRadius: 9, backgroundColor: colors.whiteWash06, alignItems: 'center', justifyContent: 'center' },
  presetText: { fontSize: 12, fontWeight: '600', color: colors.textBody },
  detailRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  detailLabel: { fontSize: 13, color: colors.textFaint },
  detailValue: { fontSize: 13, fontWeight: '600' },
  confirmBtn: { height: 54, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginTop: 18 },
  confirmText: { fontFamily: fontFamily.display, fontSize: 15.5, fontWeight: '700', color: colors.bg },
});
