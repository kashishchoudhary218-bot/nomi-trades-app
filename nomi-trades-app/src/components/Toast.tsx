import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';
import { CheckIcon } from './Icons';
import { useTradingStore } from '../store/useTradingStore';

export function Toast() {
  const toast = useTradingStore((s) => s.toast);
  if (!toast) return null;
  return (
    <View style={styles.wrap} pointerEvents="none">
      <View style={styles.badge}>
        <CheckIcon />
      </View>
      <Text style={styles.text}>{toast}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 96,
    borderRadius: 14,
    backgroundColor: '#1c2530',
    borderWidth: 1,
    borderColor: colors.upBorder,
    padding: 13,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 18 },
    elevation: 12,
  },
  badge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(53,209,154,.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: fontFamily.body,
    fontSize: 13,
    color: colors.textHigh,
    flexShrink: 1,
  },
});
