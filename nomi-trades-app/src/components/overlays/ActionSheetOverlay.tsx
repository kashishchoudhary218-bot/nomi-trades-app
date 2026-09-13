import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { useTradingStore } from '../../store/useTradingStore';
import { fmt0 } from '../../engine/format';

const DEMO_BALANCE_PRESETS = [100000, 500000, 1000000, 5000000];

interface SheetItemVM {
  key: string;
  name: string;
  value: string;
  bg: string;
  fg: string;
  onPress: () => void;
}

export function ActionSheetOverlay() {
  const insets = useSafeAreaInsets();
  const sheet = useTradingStore((s) => s.sheet);
  const closeSheet = useTradingStore((s) => s.closeSheet);
  const setDemoBalance = useTradingStore((s) => s.setDemoBalance);
  const openTerminal = useTradingStore((s) => s.openTerminal);
  const emailStatement = useTradingStore((s) => s.emailStatement);
  const archiveAccount = useTradingStore((s) => s.archiveAccount);
  const account = useTradingStore((s) => s.accounts.find((a) => a.id === sheet?.acc));

  if (!sheet) return null;

  const items: SheetItemVM[] =
    sheet.kind === 'setbal'
      ? DEMO_BALANCE_PRESETS.map((v) => ({
          key: String(v),
          name: 'Set to ' + fmt0(v) + ' ' + (account?.curr ?? 'INR'),
          value: '',
          bg: colors.surfaceDark,
          fg: colors.textHigh,
          onPress: () => setDemoBalance(sheet.acc, v),
        }))
      : [
          { key: 'terminal', name: 'Open terminal', value: '', bg: colors.surfaceDark, fg: colors.textHigh, onPress: () => openTerminal(undefined, sheet.acc) },
          { key: 'statement', name: 'Account statement', value: 'PDF', bg: colors.surfaceDark, fg: colors.textHigh, onPress: () => emailStatement(sheet.acc) },
          { key: 'server', name: 'Trading server', value: 'NomiZero-MT5', bg: colors.surfaceDark, fg: colors.textHigh, onPress: closeSheet },
          { key: 'archive', name: 'Archive account', value: '', bg: colors.downSoft, fg: colors.downText, onPress: () => archiveAccount(sheet.acc) },
        ];

  return (
    <View style={styles.overlay}>
      <Pressable style={{ flex: 1 }} onPress={closeSheet} />
      <View style={[styles.sheet, { paddingBottom: Math.max(26, insets.bottom + 14) }]}>
        <View style={styles.grabber} />
        <Text style={styles.title}>{sheet.title}</Text>
        <Text style={styles.sub}>{sheet.sub}</Text>
        <View style={{ gap: 9, marginTop: 16 }}>
          {items.map((item) => (
            <Pressable key={item.key} style={[styles.item, { backgroundColor: item.bg }]} onPress={item.onPress}>
              <Text style={{ fontSize: 13.5, fontWeight: '600', color: item.fg }}>{item.name}</Text>
              {item.value ? <Text style={styles.itemValue}>{item.value}</Text> : null}
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.overlayScrim, zIndex: 30, justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 26, borderTopRightRadius: 26, borderBottomLeftRadius: 41, borderBottomRightRadius: 41, backgroundColor: colors.card, borderTopWidth: 1, borderColor: colors.whiteWash08, padding: 20, paddingTop: 14 },
  grabber: { width: 38, height: 4, borderRadius: 999, backgroundColor: colors.whiteWash16, alignSelf: 'center', marginBottom: 16 },
  title: { fontFamily: fontFamily.display, fontSize: 17, fontWeight: '600', color: colors.textPrimary },
  sub: { fontSize: 12.5, color: colors.textFaint, marginTop: 5, lineHeight: 18.75 },
  item: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 48, paddingHorizontal: 15, borderRadius: 13 },
  itemValue: { fontSize: 12, color: colors.textDim },
});
