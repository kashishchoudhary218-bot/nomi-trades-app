import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';
import { Instrument } from '../types';
import { Sparkline } from './charts/Sparkline';
import { MiniBars } from './Icons';

interface Props {
  instrument: Instrument;
  price: string;
  chg: string;
  path: string;
  stroke: string;
  onPress: () => void;
}

export function InstrumentRow({ instrument, price, chg, path, stroke, onPress }: Props) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={[styles.mark, { backgroundColor: instrument.tint }]}>
        <Text style={styles.markText}>{instrument.mark}</Text>
      </View>
      <View style={styles.mid}>
        <View style={styles.symRow}>
          <Text style={styles.sym}>{instrument.sym}</Text>
          <MiniBars />
        </View>
        <Text style={styles.desc} numberOfLines={1}>
          {instrument.desc}
        </Text>
      </View>
      <Sparkline path={path} stroke={stroke} width={72} height={30} dashedMidline />
      <View style={styles.priceCol}>
        <Text style={styles.price}>{price}</Text>
        <Text style={[styles.chg, { color: stroke }]}>{chg}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    padding: 12,
    paddingHorizontal: 13,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderHairline,
  },
  mark: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  markText: { fontFamily: fontFamily.displayBold, fontSize: 11, color: colors.bg },
  mid: { flex: 1, minWidth: 0 },
  symRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  sym: { fontFamily: fontFamily.display, fontSize: 14.5, fontWeight: '600', color: colors.textPrimary },
  desc: { fontSize: 11.5, color: colors.textDim, marginTop: 3 },
  priceCol: { alignItems: 'flex-end', minWidth: 74 },
  price: { fontFamily: fontFamily.display, fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  chg: { fontSize: 12, fontWeight: '600', marginTop: 3 },
});
