import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { useTradingStore } from '../../store/useTradingStore';
import { findInstrument } from '../../data/instruments';
import { bidAsk, changePct, equityForAccount, freeMarginForAccount, marginForAccount, openPlForAccount, priceOf } from '../../engine/selectors';
import { terminalChartData } from '../../engine/charts';
import { fmt0 } from '../../engine/format';
import { CandlestickChart } from '../charts/CandlestickChart';
import { ChevronLeftIcon, CrosshairIcon, DepositIcon } from '../Icons';
import { PositionTab, Timeframe } from '../../types';

const SYMBOL_TABS = ['XAG/USD', 'EUR/USD', 'XAU/USD', 'ETH/USD', 'BTC/USD', 'USOIL'];
const TIMEFRAMES: Timeframe[] = ['1m', '5m', '15m', '1H', '4H', '1D'];
const TRADE_TABS: { name: string; key: PositionTab }[] = [
  { name: 'Open', key: 'open' },
  { name: 'Pending', key: 'pending' },
  { name: 'Closed', key: 'closed' },
];

export function TerminalOverlay() {
  const insets = useSafeAreaInsets();
  const st = useTradingStore();
  const closeTerminal = useTradingStore((s) => s.closeTerminal);
  const setTSym = useTradingStore((s) => s.setTSym);
  const setTTf = useTradingStore((s) => s.setTTf);
  const toggleEma = useTradingStore((s) => s.toggleEma);
  const toggleCross = useTradingStore((s) => s.toggleCross);
  const setTermTab = useTradingStore((s) => s.setTermTab);
  const openTicket = useTradingStore((s) => s.openTicket);
  const closePosition = useTradingStore((s) => s.closePosition);
  const showToast = useTradingStore((s) => s.showToast);

  const account = st.accounts.find((a) => a.id === st.selAcc) ?? st.accounts[0];
  const inst = findInstrument(st.tSym);
  const pct = changePct(st.px, st.tSym);
  const up = pct >= 0;
  const { bid, ask } = bidAsk(st.px, st.tSym);

  const chart = useMemo(() => terminalChartData(st.tSym, st.tTf, st.px), [st.tSym, st.tTf, st.px]);

  const openPl = openPlForAccount(st.positions, st.px, account.id);
  const equity = equityForAccount(account, st.positions, st.px);
  const margin = marginForAccount(st.positions, account.id);
  const freeMargin = freeMarginForAccount(account, st.positions, st.px);

  const termRows = useMemo(() => {
    if (st.termTab === 'open') {
      return st.positions
        .filter((p) => p.acc === account.id)
        .map((p) => {
          const i = findInstrument(p.sym);
          const g = (st.px[p.sym] - p.entry) * (p.side === 'Buy' ? 1 : -1) * p.lots * i.mult / 100;
          return {
            id: p.id,
            sym: p.sym,
            side: p.side + ' ' + p.lots.toFixed(2),
            sideColor: p.side === 'Buy' ? colors.blue : colors.downText,
            pnl: (g >= 0 ? '+' : '') + fmt0(g),
            pnlColor: g >= 0 ? colors.up : colors.down,
            detail: 'Entry ' + p.entry.toFixed(i.dec) + ' → ' + priceOf(st.px, p.sym),
            live: true,
          };
        });
    }
    if (st.termTab === 'closed') {
      return st.closed
        .filter((c) => c.acc === account.id)
        .slice(0, 8)
        .map((c) => {
          const i = findInstrument(c.sym);
          return {
            id: c.id,
            sym: c.sym,
            side: c.side + ' ' + c.lots.toFixed(2),
            sideColor: c.side === 'Buy' ? colors.blue : colors.downText,
            pnl: (c.pnl >= 0 ? '+' : '') + fmt0(c.pnl),
            pnlColor: c.pnl >= 0 ? colors.up : colors.down,
            detail: c.tag + ' · exit ' + c.exit.toFixed(i.dec),
            live: false,
          };
        });
    }
    return [];
  }, [st.termTab, st.positions, st.closed, st.px, account.id]);

  const termEmpty = st.termTab === 'pending' ? 'No pending orders on this account.' : 'Nothing to show for this account yet.';

  return (
    <View style={styles.overlay}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable style={styles.closeBtn} onPress={closeTerminal}>
          <ChevronLeftIcon />
        </Pressable>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={styles.title}>Terminal</Text>
          <Text style={styles.subtitle}>
            {account.label} · #{account.num} · {account.mode}
          </Text>
        </View>
        <View style={styles.statusPill}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Market open</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.symTabsRow}>
        {SYMBOL_TABS.map((sym) => {
          const p = changePct(st.px, sym);
          const active = sym === st.tSym;
          return (
            <Pressable
              key={sym}
              onPress={() => setTSym(sym)}
              style={[styles.symTab, { backgroundColor: active ? colors.accentSoft : colors.card, borderColor: active ? colors.accentBorder : colors.borderHairline2 }]}
            >
              <Text style={{ fontFamily: fontFamily.display, fontSize: 12.5, fontWeight: '600', color: active ? colors.accent : colors.textCoolGray }}>{sym}</Text>
              <Text style={{ fontSize: 10.5, fontWeight: '600', color: p >= 0 ? colors.up : colors.down }}>{(p >= 0 ? '+' : '') + p.toFixed(2) + '%'}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.priceRow}>
          <View>
            <Text style={styles.price}>{priceOf(st.px, st.tSym)}</Text>
            <Text style={styles.symDesc}>{inst.desc}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 12.5, fontWeight: '600', color: up ? colors.up : colors.down }}>{(up ? '↑ ' : '↓ ') + Math.abs(pct).toFixed(2) + '%'}</Text>
            <View style={styles.bidAskRow}>
              <View>
                <Text style={styles.bidAskLabel}>BID</Text>
                <Text style={styles.bidValue}>{bid.toFixed(inst.dec)}</Text>
              </View>
              <View>
                <Text style={styles.bidAskLabel}>ASK</Text>
                <Text style={styles.askValue}>{ask.toFixed(inst.dec)}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.tfRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={{ gap: 5 }}>
            {TIMEFRAMES.map((t) => {
              const active = st.tTf === t;
              return (
                <Pressable key={t} onPress={() => setTTf(t)} style={[styles.tfChip, { backgroundColor: active ? colors.accentSofter : colors.whiteWash06 }]}>
                  <Text style={{ fontSize: 11.5, fontWeight: '600', color: active ? colors.accent : colors.textMuted }}>{t}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
          <Pressable onPress={toggleEma} style={[styles.emaChip, { backgroundColor: st.ema ? colors.accentSofter : colors.whiteWash06 }]}>
            <Text style={{ fontSize: 11.5, fontWeight: '600', color: st.ema ? colors.accent : colors.textMuted }}>EMA 9</Text>
          </Pressable>
          <Pressable onPress={toggleCross} style={[styles.crossChip, { backgroundColor: st.cross ? colors.accentSofter : colors.whiteWash06 }]}>
            <CrosshairIcon color={st.cross ? colors.accent : colors.textMuted} />
          </Pressable>
        </View>

        <View style={styles.chartWrap}>
          <CandlestickChart data={chart} ema={st.ema} cross={st.cross} baselineColor={up ? colors.up : colors.down} />
        </View>

        <View style={styles.metricsGrid}>
          {[
            { label: 'EQUITY', value: fmt0(equity), color: '#fff' },
            { label: 'BALANCE', value: fmt0(account.bal), color: '#fff' },
            { label: 'FREE MARGIN', value: fmt0(freeMargin), color: freeMargin >= 0 ? '#fff' : colors.down },
            { label: 'MARGIN', value: fmt0(margin), color: '#fff' },
            { label: 'MARGIN LEVEL', value: margin ? Math.round((equity / margin) * 100) + '%' : '—', color: margin && equity / margin < 1.5 ? colors.down : colors.up },
            { label: 'OPEN P/L', value: (openPl >= 0 ? '+' : '') + fmt0(openPl), color: openPl >= 0 ? colors.up : colors.down },
          ].map((m) => (
            <View key={m.label} style={styles.metricCard}>
              <Text style={styles.metricLabel}>{m.label}</Text>
              <Text style={[styles.metricValue, { color: m.color }]}>{m.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.tradeTabsRow}>
          {TRADE_TABS.map((t) => {
            const active = st.termTab === t.key;
            return (
              <Pressable key={t.key} onPress={() => setTermTab(t.key)} style={[styles.tradeTab, { borderBottomColor: active ? colors.accent : 'transparent' }]}>
                <Text style={{ fontSize: 13.5, fontWeight: '600', color: active ? colors.textPrimary : colors.textDim }}>{t.name}</Text>
              </Pressable>
            );
          })}
        </View>

        {termRows.length > 0 ? (
          <View style={{ gap: 9, paddingTop: 12 }}>
            {termRows.map((r) => (
              <View key={r.id} style={styles.termRowCard}>
                <View style={styles.termRowTop}>
                  <View style={styles.termRowSym}>
                    <Text style={styles.termRowSymText}>{r.sym}</Text>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: r.sideColor }}>{r.side}</Text>
                  </View>
                  <Text style={{ fontFamily: fontFamily.display, fontSize: 13.5, fontWeight: '600', color: r.pnlColor }}>{r.pnl}</Text>
                </View>
                <View style={styles.termRowBottom}>
                  <Text style={styles.termRowDetail}>{r.detail}</Text>
                  {r.live ? (
                    <Pressable style={styles.termCloseBtn} onPress={() => closePosition(r.id)}>
                      <Text style={styles.termCloseBtnText}>Close</Text>
                    </Pressable>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.termEmpty}>{termEmpty}</Text>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(16, insets.bottom + 8) }]}>
        <Pressable
          style={styles.depositBtn}
          onPress={() => showToast(account.mode === 'Demo' ? 'Demo account — use Set balance' : 'Deposit request opened')}
        >
          <DepositIcon color={colors.accent} />
          <Text style={styles.depositText}>Deposit</Text>
        </Pressable>
        <Pressable style={styles.sellBtn} onPress={() => openTicket('Sell', st.tSym)}>
          <Text style={styles.sellLabel}>SELL</Text>
          <Text style={styles.sellValue}>{bid.toFixed(inst.dec)}</Text>
        </Pressable>
        <Pressable style={styles.buyBtn} onPress={() => openTicket('Buy', st.tSym)}>
          <Text style={styles.buyLabel}>BUY</Text>
          <Text style={styles.buyValue}>{ask.toFixed(inst.dec)}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.bg, zIndex: 20 },
  header: { paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10 },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.chip, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fontFamily.display, fontSize: 14.5, fontWeight: '600', color: colors.textPrimary },
  subtitle: { fontSize: 11, color: colors.textDim, marginTop: 1 },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, backgroundColor: colors.upSoft },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.up },
  statusText: { fontSize: 11, fontWeight: '600', color: colors.up },
  symTabsRow: { gap: 7, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10 },
  symTab: { alignItems: 'flex-start', gap: 2, paddingHorizontal: 11, paddingVertical: 7, borderRadius: 11, borderWidth: 1 },
  body: { paddingHorizontal: 16, paddingBottom: 16 },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  price: { fontFamily: fontFamily.display, fontSize: 29, fontWeight: '700', color: colors.textPrimary, letterSpacing: -0.8 },
  symDesc: { fontSize: 12, color: colors.textDim, marginTop: 3 },
  bidAskRow: { flexDirection: 'row', gap: 10, marginTop: 5 },
  bidAskLabel: { fontSize: 10, letterSpacing: 1, color: colors.textDim, fontWeight: '600' },
  bidValue: { fontFamily: fontFamily.display, fontSize: 12.5, fontWeight: '600', color: colors.downText },
  askValue: { fontFamily: fontFamily.display, fontSize: 12.5, fontWeight: '600', color: colors.up },
  tfRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 },
  tfChip: { paddingHorizontal: 10, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  emaChip: { paddingHorizontal: 10, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  crossChip: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  chartWrap: { marginTop: 12, borderRadius: 16, backgroundColor: colors.surfaceDark, borderWidth: 1, borderColor: colors.borderHairline, overflow: 'hidden' },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  metricCard: { width: '31.5%', borderRadius: 13, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.borderHairline, padding: 11 },
  metricLabel: { fontSize: 9.5, letterSpacing: 1, color: colors.textDim, fontWeight: '600' },
  metricValue: { fontFamily: fontFamily.display, fontSize: 13, fontWeight: '600', marginTop: 5 },
  tradeTabsRow: { flexDirection: 'row', alignItems: 'center', gap: 22, marginTop: 18, borderBottomWidth: 1, borderBottomColor: colors.borderHairline3 },
  tradeTab: { paddingBottom: 9, borderBottomWidth: 2 },
  termRowCard: { borderRadius: 14, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.borderHairline, padding: 12, paddingHorizontal: 13 },
  termRowTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  termRowSym: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  termRowSymText: { fontFamily: fontFamily.display, fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  termRowBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 },
  termRowDetail: { fontSize: 11.5, color: colors.textFaint },
  termCloseBtn: { paddingHorizontal: 11, paddingVertical: 5, borderRadius: 8, backgroundColor: colors.downSoftest },
  termCloseBtnText: { fontSize: 11.5, fontWeight: '600', color: colors.downText },
  termEmpty: { paddingVertical: 30, paddingHorizontal: 16, textAlign: 'center', fontSize: 12.5, color: colors.textDim, lineHeight: 19 },
  footer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 11,
    backgroundColor: '#0E141B',
    borderTopWidth: 1,
    borderTopColor: colors.borderHairline2,
  },
  depositBtn: { width: 52, height: 50, borderRadius: 14, backgroundColor: colors.accentSofter, alignItems: 'center', justifyContent: 'center', gap: 2 },
  depositText: { fontSize: 9, fontWeight: '600', color: colors.accent },
  sellBtn: { flex: 1, height: 50, borderRadius: 14, backgroundColor: colors.downSoftest, borderWidth: 1, borderColor: colors.downBorder28, alignItems: 'center', justifyContent: 'center' },
  sellLabel: { fontSize: 10.5, color: colors.downText, letterSpacing: 0.8, fontWeight: '600' },
  sellValue: { fontFamily: fontFamily.display, fontSize: 14.5, fontWeight: '700', color: colors.textPrimary },
  buyBtn: { flex: 1, height: 50, borderRadius: 14, backgroundColor: colors.upSoftest, borderWidth: 1, borderColor: colors.upBorder, alignItems: 'center', justifyContent: 'center' },
  buyLabel: { fontSize: 10.5, color: colors.up, letterSpacing: 0.8, fontWeight: '600' },
  buyValue: { fontFamily: fontFamily.display, fontSize: 14.5, fontWeight: '700', color: colors.textPrimary },
});
