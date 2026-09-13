import React, { ReactNode } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';

interface Props {
  children: ReactNode;
  onPress?: () => void;
  size?: number;
  background?: string;
  style?: ViewStyle;
  badge?: boolean;
}

export function IconButton({ children, onPress, size = 34, background = colors.chip, style, badge }: Props) {
  return (
    <Pressable onPress={onPress} hitSlop={8} style={[styles.base, { width: size, height: size, borderRadius: size / 2, backgroundColor: background }, style]}>
      {children}
      {badge ? <View style={styles.badgeDot} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeDot: {
    position: 'absolute',
    top: 6,
    right: 7,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.down,
    borderWidth: 2,
    borderColor: colors.bg,
  },
});
