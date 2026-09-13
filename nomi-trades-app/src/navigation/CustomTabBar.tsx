import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { TabAccountsIcon, TabInsightsIcon, TabMarketsIcon, TabPerfIcon, TabProfileIcon } from '../components/Icons';
import { IconProps } from '../components/Icons';

const TAB_ICONS: Record<string, (props: IconProps) => React.JSX.Element> = {
  Accounts: TabAccountsIcon,
  Markets: TabMarketsIcon,
  Insights: TabInsightsIcon,
  Performance: TabPerfIcon,
  Profile: TabProfileIcon,
};

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(12, insets.bottom) }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = (options.tabBarLabel as string) ?? route.name;
        const focused = state.index === index;
        const color = focused ? colors.accent : colors.textDimmer;
        const Icon = TAB_ICONS[route.name];

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable key={route.key} onPress={onPress} style={styles.item}>
            {Icon ? <Icon color={color} /> : null}
            <Text style={[styles.label, { color }]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    paddingTop: 9,
    paddingHorizontal: 6,
    backgroundColor: '#0E141B',
    borderTopWidth: 1,
    borderTopColor: colors.borderHairline2,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 5,
  },
  label: {
    fontSize: 10.5,
  },
});
