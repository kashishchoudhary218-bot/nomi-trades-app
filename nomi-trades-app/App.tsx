import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useAppFonts } from './src/theme/fonts';
import { colors } from './src/theme/colors';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useTradingStore } from './src/store/useTradingStore';
import { TerminalOverlay } from './src/components/overlays/TerminalOverlay';
import { InstrumentDetailOverlay } from './src/components/overlays/InstrumentDetailOverlay';
import { OrderTicketOverlay } from './src/components/overlays/OrderTicketOverlay';
import { ActionSheetOverlay } from './src/components/overlays/ActionSheetOverlay';
import { Toast } from './src/components/Toast';

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
    card: colors.bg,
    text: colors.textPrimary,
    border: colors.borderHairline2,
  },
};

export default function App() {
  const [fontsLoaded] = useAppFonts();
  const startPriceFeed = useTradingStore((s) => s.startPriceFeed);
  const stopPriceFeed = useTradingStore((s) => s.stopPriceFeed);
  const terminal = useTradingStore((s) => s.terminal);
  const detailSym = useTradingStore((s) => s.detailSym);
  const ticket = useTradingStore((s) => s.ticket);
  const sheet = useTradingStore((s) => s.sheet);

  useEffect(() => {
    startPriceFeed();
    return () => stopPriceFeed();
  }, [startPriceFeed, stopPriceFeed]);

  if (!fontsLoaded) {
    return <View style={styles.root} />;
  }

  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        <NavigationContainer theme={navTheme}>
          <RootNavigator />
        </NavigationContainer>

        {terminal ? <TerminalOverlay /> : null}
        {detailSym ? <InstrumentDetailOverlay /> : null}
        {ticket ? <OrderTicketOverlay /> : null}
        {sheet ? <ActionSheetOverlay /> : null}
        <Toast />

        <StatusBar style="light" />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
